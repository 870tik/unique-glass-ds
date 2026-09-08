  /* ---------- 体質 physique（R17） ----------
     動き・光学の2軸 trait（0〜1）が、対応する性質群を min/max の間で確定する。
     trait のソース（優先順）:
       1. ホスト指定: html[data-lg-trait-motion / -optics]（抽象値のみ。
          生の個人データ・検索履歴等は DS の境界の外 — 受けない）
       2. 端末内学習: 操作テンポ（personal モードのみ。翌訪問に反映）
       3. 既定トークン（0.5 = 現行値）
     OS 信号: prefers-reduced-motion は motion trait を 0 に固定。 */
  var physiqueInfo = { motion: 0.5, optics: 0.5, source: 'default' };

  function phLerp(minName, maxName, t) {
    var a = cssNum(minName, 0), b = cssNum(maxName, 0);
    return a + (b - a) * t;
  }
  function initPhysique() {
    var mode = root.getAttribute('data-lg-observer') === 'personal' ? 'personal' : 'fixed';
    var m = parseFloat(root.getAttribute('data-lg-trait-motion'));
    var o = parseFloat(root.getAttribute('data-lg-trait-optics'));
    var source = 'default';
    if (!isNaN(m) || !isNaN(o)) source = 'host';
    if (isNaN(m) && mode === 'personal') {
      try { m = parseFloat(localStorage.getItem('lg-trait-motion')); source = 'learned'; } catch (_) {}
    }
    if (isNaN(m)) m = cssNum('--lg-physique-motion-default', 0.5);
    if (isNaN(o)) o = cssNum('--lg-physique-optics-default', 0.5);
    /* 深夜は光学が静かに（端末時計のみ・保存しない） */
    var h = new Date().getHours();
    if (source !== 'host' && (h >= 23 || h < 6)) o = Math.max(0, o - 0.15);
    if (reduceMotion) m = 0;
    m = Math.min(1, Math.max(0, m));
    o = Math.min(1, Math.max(0, o));
    physiqueInfo = { motion: m, optics: o, source: source };

    var set = function (name, v) { root.style.setProperty(name, String(v)); };
    /* 動き軸 */
    set('--lg-motion-gel-wobble-zeta', phLerp('--lg-physique-wobble-zeta-min', '--lg-physique-wobble-zeta-max', m).toFixed(3));
    set('--lg-motion-gel-squash-y', phLerp('--lg-physique-squash-y-min', '--lg-physique-squash-y-max', m).toFixed(3));
    set('--lg-motion-gel-stretch-x', phLerp('--lg-physique-stretch-x-min', '--lg-physique-stretch-x-max', m).toFixed(3));
    set('--lg-motion-gel-hover-scale', phLerp('--lg-physique-hover-scale-min', '--lg-physique-hover-scale-max', m).toFixed(3));
    set('--lg-light-breath-depth', phLerp('--lg-physique-breath-depth-min', '--lg-physique-breath-depth-max', m).toFixed(3));
    /* 光学軸 */
    set('--lg-motion-gel-optics-press', phLerp('--lg-physique-optics-press-min', '--lg-physique-optics-press-max', o).toFixed(3));
    set('--lg-ref-lens-ca', phLerp('--lg-physique-ca-min', '--lg-physique-ca-max', o).toFixed(2));
    set('--lg-ref-lens-organic', phLerp('--lg-physique-organic-min', '--lg-physique-organic-max', o).toFixed(3));
    set('--lg-light-hover-intensity', phLerp('--lg-physique-hover-int-min', '--lg-physique-hover-int-max', o).toFixed(3));

    /* 端末内学習（personal のみ）: 操作テンポ → 動き trait を翌訪問へ ±0.08 まで漂わせる */
    if (mode === 'personal' && !reduceMotion) {
      var taps = [];
      document.addEventListener('pointerdown', function () {
        var t = performance.now();
        taps.push(t);
        if (taps.length > 12) taps.shift();
      });
      window.addEventListener('pagehide', function () {
        if (taps.length < 5) return;
        var gaps = [];
        for (var i = 1; i < taps.length; i++) gaps.push(taps[i] - taps[i - 1]);
        gaps.sort(function (a, b) { return a - b; });
        var median = gaps[Math.floor(gaps.length / 2)];
        /* 速いテンポ（<1.2s）→ 活発へ、遅い（>4s）→ 静かへ */
        var drift = median < 1200 ? 0.04 : median > 4000 ? -0.04 : 0;
        if (!drift) return;
        var next = Math.min(0.58, Math.max(0.42, m + drift)); /* 学習の可動域は ±0.08 */
        try { localStorage.setItem('lg-trait-motion', next.toFixed(3)); } catch (_) {}
      });
    }
  }
