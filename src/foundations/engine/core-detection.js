/* ============================================================
   liquid-glass.js — lens engine / Spring / virtual light / init
   plain script, zero dependencies. requires css/tokens.css +
   css/liquid-glass.css. 値の由来は tokens.json の $description。
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reduceTransp = matchMedia('(prefers-reduced-transparency: reduce)').matches;

  /* ---------- capability detection ----------
     backdrop-filter: url() は Chromium 限定。@supports は Safari で
     偽陽性があるため UA 判定を併用する（リサーチ確定事項）。 */
  var isChromium = /Chrom(e|ium)\//.test(navigator.userAgent);
  var bfOK = CSS.supports('backdrop-filter', 'blur(1px)') ||
             CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
  var urlOK = CSS.supports('backdrop-filter', 'url(#f)');
  var mode = reduceTransp ? 'opaque'
           : (isChromium && bfOK && urlOK) ? 'lens'
           : bfOK ? 'baseline' : 'opaque';

  root.classList.add('lg-js', 'lg-mode-' + mode);

  /* 共有ポインタ座標 — スクロール時の hover 実判定用。Chrome は次の mousemove まで
     :hover を再計算しないことがあるため、:hover 擬似クラスは信用しない */
  var lgPX = -1, lgPY = -1;
  document.addEventListener('pointermove', function (e) { lgPX = e.clientX; lgPY = e.clientY; }, true);
  function lgPointerOver(el) { /* 実ヒットテスト（現在のポインタ座標が el 上か） */
    if (lgPX < 0) return false;
    var r = el.getBoundingClientRect();
    if (lgPX < r.left || lgPX > r.right || lgPY < r.top || lgPY > r.bottom) return false;
    var at = document.elementFromPoint(lgPX, lgPY);
    return !!(at && (at === el || el.contains(at)));
  }
