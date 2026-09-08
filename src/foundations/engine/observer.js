  /* ---------- 観測者効果 observer effect（R16） ----------
     トークンは範囲を定義し、観測者シードが値を確定する。
     mode: html[data-lg-observer] = "personal"（ブラウザごとに永続シード）
           / "fixed"（既定。data-lg-seed か 0 で決定的）
     揺れる軸: 分光色相・光源基準角・呼吸周期・個体差プール。
     不変: コントラスト・予算・レイアウト・状態色の意味。
     accent（primary）は環境光と同角で回る = 背景のうっすらした色と常に同調。 */
  var obsSeedOffset = 0;
  var observerInfo = { mode: 'fixed', seed: '0' };

  function obsHash(str) { /* xorshift 系の決定的ハッシュ → [0,1) を4本 */
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    var out = [];
    for (var j = 0; j < 4; j++) {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      out.push(((h >>> 0) % 10000) / 10000);
    }
    return out;
  }
  function hexToHsl(hex) {
    var n = parseInt(hex.slice(1), 16);
    var r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    var d = mx - mn, h = 0, s = 0;
    if (d) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }
  function hslCss(h, s, l) {
    return 'hsl(' + ((h % 360 + 360) % 360).toFixed(1) + ', ' +
      (s * 100).toFixed(1) + '%, ' + (l * 100).toFixed(1) + '%)';
  }
  function initObserver() {
    var mode = root.getAttribute('data-lg-observer') === 'personal' ? 'personal' : 'fixed';
    var seed;
    if (mode === 'personal') {
      try {
        seed = localStorage.getItem('lg-observer-seed');
        if (!seed) {
          seed = String(Math.floor(Math.random() * 1e9));
          localStorage.setItem('lg-observer-seed', seed);
        }
      } catch (_) { seed = '0'; }
    } else {
      seed = root.getAttribute('data-lg-seed') || '0';
    }
    var r = obsHash('lg:' + seed);
    observerInfo = { mode: mode, seed: seed };

    /* 軸1: 分光の色相回転（cool/warm を同角回転 = 補色関係を保つ） */
    var rot = cssNum('--lg-observer-spectrum-rotation', 0);
    if (rot > 0) {
      var deg = (r[0] * 2 - 1) * rot;
      ['cool', 'warm'].forEach(function (k) {
        var hex = cssVal('--lg-ref-color-spectrum-' + k);
        if (/^#[0-9a-f]{6}$/i.test(hex)) {
          var hsl = hexToHsl(hex);
          root.style.setProperty('--lg-light-rim-spec-' + k, hslCss(hsl[0] + deg, hsl[1], hsl[2]));
        }
      });
      observerInfo.spectrumShift = Math.round(deg);
    }
    /* 軸2: 光源の基準角 */
    var ar = cssNum('--lg-observer-angle-range', 0);
    if (ar > 0) {
      var base = 215 + (r[1] * 2 - 1) * ar;
      root.style.setProperty('--lg-la', base.toFixed(1) + 'deg');
      observerInfo.angle = Math.round(base);
    }
    /* 軸3: 呼吸周期 */
    var bmin = cssNum('--lg-observer-breath-min', 0);
    var bmax = cssNum('--lg-observer-breath-max', 0);
    if (bmax > bmin && bmin > 0) {
      var period = bmin + r[2] * (bmax - bmin);
      root.style.setProperty('--lg-light-breath-period', Math.round(period) + 'ms');
      observerInfo.breath = Math.round(period);
    }
    /* 軸4: 環境光の色相（hover 不要・SP でも開いた瞬間に見える）。
       primary（accent）も同角で回し、背景のうっすらした色と常に同調させる
       （R16 改訂: 状態色 danger/warning/success の意味色は不変のまま） */
    var amb = cssNum('--lg-observer-ambient-rotation', 0);
    if (amb > 0) {
      var ambDeg = r[3] * amb; /* フルホイール配置（R16補遺2） */
      root.style.setProperty('--lg-obs-ambient', ambDeg.toFixed(1) + 'deg');
      observerInfo.ambient = Math.round(ambDeg);
      ['accent', 'accent-deep', 'accent-solid'].forEach(function (k) {
        var hex = cssVal('--lg-ref-color-' + k);
        if (/^#[0-9a-f]{6}$/i.test(hex)) {
          var hsl = hexToHsl(hex);
          root.style.setProperty('--lg-ref-color-' + k, hslCss(hsl[0] + ambDeg, hsl[1], hsl[2]));
        }
      });
    }
    /* 軸5: 個体差プールのずれ */
    obsSeedOffset = Math.floor(((r[0] + r[3]) * 7) % 4);
  }
