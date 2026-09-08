  /* ---------- 環境信号 signals（R18） ----------
     素材が置かれた「現実の環境」に応答する4信号。すべて端末内で完結し、
     ネットワーク送信・生データの保存はしない（R17 のプライバシー境界の内側）。
       太陽同期    : 端末時刻から太陽方位を近似し、仮想光源の基準角を実際の太陽に合わせる
       傾き応答    : 端末の傾きに光源が 1:1 追従（SP の hover 代替。iOS は明示許諾）
       バッテリー  : 残量低下で呼吸が浅く・省エネに（生き物の疲労 + 描画コスト配慮）
       懐き        : 訪問日数で生命徴が開く（初訪は人見知り。personal モードのみ）
     各信号は --lg-signals-* トークンで個別に無効化できる（apple-quiet は全オフ） */
  var signalsInfo = { sun: 'off', tilt: 'off', battery: 'off', affinity: 'off' };
  var sigBase = null;   /* physique 適用後の基準値（乗算のベース） */
  var sigTired = false; /* バッテリー疲労状態 */
  var sigAffinity = 1;  /* 懐き 0〜1（fixed モードは常に 1 = 決定性維持） */

  /* 太陽方位の近似: 正午 = 既定角 215、日の出/日の入りで ±70°。夜は既定角。
     観測者の角度個性（R16 軸2）はオフセットとして太陽の上に残る */
  function sunAngle() {
    var d = new Date();
    var t = d.getHours() + d.getMinutes() / 60;
    if (t < 6 || t > 18) return null; /* 夜 */
    return 215 + ((t - 12) / 6) * 70;
  }

  /* 信号による補正を physique の基準値に乗せて再適用する。
     battery は非同期解決のため、後から呼び直しても安全な冪等設計 */
  function applySignalMods() {
    if (!sigBase) return;
    var a = sigAffinity;
    var fBreath = (0.4 + 0.6 * a) * (sigTired ? 0.5 : 1);
    var fHover = (0.6 + 0.4 * a) * (sigTired ? 0.85 : 1);
    root.style.setProperty('--lg-light-breath-depth', (sigBase.breath * fBreath).toFixed(3));
    root.style.setProperty('--lg-light-hover-intensity', (sigBase.hover * fHover).toFixed(3));
    /* 疲れているときは押しても屈折が深く潰れない（省エネの身体性） */
    var op = sigTired ? sigBase.opress + (1 - sigBase.opress) * 0.5 : sigBase.opress;
    root.style.setProperty('--lg-motion-gel-optics-press', op.toFixed(3));
  }

  var tiltAttach = null; /* iOS: 許諾後に呼ぶ実体（enableTilt から） */
  function initSignals() {
    sigBase = {
      breath: cssNum('--lg-light-breath-depth', 0.3),
      hover: cssNum('--lg-light-hover-intensity', 0.8),
      opress: cssNum('--lg-motion-gel-optics-press', 0.3)
    };
    var personal = root.getAttribute('data-lg-observer') === 'personal';
    var obsOffset = (observerInfo.angle != null) ? observerInfo.angle - 215 : 0;
    var baseAngle = 215 + obsOffset;

    /* --- 太陽同期 --- */
    if (cssNum('--lg-signals-sun-sync', 0) > 0) {
      var sa = sunAngle();
      if (sa != null) {
        baseAngle = sa + obsOffset;
        root.style.setProperty('--lg-la', baseAngle.toFixed(1) + 'deg');
        signalsInfo.sun = { angle: Math.round(baseAngle) };
      } else {
        signalsInfo.sun = 'night';
      }
    }

    /* --- 傾き応答（光源が端末の傾きに 1:1 追従。公理5: 追従に慣性なし） --- */
    if (cssNum('--lg-signals-tilt', 0) > 0 && typeof DeviceOrientationEvent !== 'undefined') {
      var neutralBeta = null, pendTilt = null;
      var onTilt = function (e) {
        if (e.gamma == null || e.beta == null) return;
        if (neutralBeta == null) neutralBeta = e.beta; /* 最初の姿勢を中立に */
        var g = Math.max(-45, Math.min(45, e.gamma));
        var db = Math.max(-45, Math.min(45, e.beta - neutralBeta));
        var off = g * 1.2 + db * 0.6;
        if (pendTilt != null) return; /* rAF 間引き */
        pendTilt = requestAnimationFrame(function () {
          pendTilt = null;
          root.style.setProperty('--lg-la', (baseAngle + off).toFixed(1) + 'deg');
        });
        signalsInfo.tilt = 'active';
      };
      tiltAttach = function () {
        window.addEventListener('deviceorientation', onTilt);
        signalsInfo.tilt = 'listening';
      };
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        signalsInfo.tilt = 'needs-permission'; /* iOS: LiquidGlass.enableTilt() をジェスチャーから */
      } else {
        tiltAttach();
      }
    }

    /* --- 懐き（訪問日数 → 生命徴の開き。personal のみ・日単位・リセット可） --- */
    if (cssNum('--lg-signals-affinity', 0) > 0 && personal) {
      var days = 1;
      try {
        var rec = JSON.parse(localStorage.getItem('lg-affinity') || '{}');
        var today = new Date().toISOString().slice(0, 10);
        days = (rec.n || 0) + (rec.d === today ? 0 : 1);
        if (rec.d !== today) localStorage.setItem('lg-affinity', JSON.stringify({ d: today, n: days }));
        else days = rec.n;
      } catch (_) {}
      var max = cssNum('--lg-signals-affinity-days-max', 8);
      sigAffinity = Math.min(1, days / max);
      signalsInfo.affinity = { days: days, openness: +sigAffinity.toFixed(2) };
      /* 個体差の風合いも通うほど開く（applyLens より前に確定させる） */
      var org = cssNum('--lg-ref-lens-organic', 0.12);
      root.style.setProperty('--lg-ref-lens-organic', (org * (0.5 + 0.5 * sigAffinity)).toFixed(3));
    }

    /* --- バッテリー = 元気（Battery API がある環境のみ） --- */
    if (cssNum('--lg-signals-battery', 0) > 0 && navigator.getBattery) {
      navigator.getBattery().then(function (b) {
        var update = function () {
          sigTired = b.level <= 0.2 && !b.charging;
          signalsInfo.battery = { level: +b.level.toFixed(2), tired: sigTired };
          applySignalMods();
        };
        b.addEventListener('levelchange', update);
        b.addEventListener('chargingchange', update);
        update();
      }).catch(function () {});
    }

    applySignalMods();
  }
