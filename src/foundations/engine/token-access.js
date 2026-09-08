  /* ---------- token access (single source = CSS custom properties) ---------- */
  var rootCS = null;
  function cssVal(name) {
    if (!rootCS) rootCS = getComputedStyle(root);
    return rootCS.getPropertyValue(name).trim();
  }
  function cssNum(name, fallback) {
    var n = parseFloat(cssVal(name));
    return isNaN(n) ? fallback : n;
  }

  var tok = null;
  var variants = null;
  function ensureTokens() {
    if (!tok) readTokens();
  }
  function readTokens() {
    rootCS = null;
    tok = {
      k: cssNum('--lg-motion-gel-k', 440),
      zeta: cssNum('--lg-motion-gel-zeta', 0.65),
      pressScale: cssNum('--lg-motion-gel-press-scale', 0.97),
      pressMs: cssNum('--lg-motion-gel-press-duration', 90),
      caR: cssNum('--lg-ref-lens-ca-split-r', 0.86),
      caB: cssNum('--lg-ref-lens-ca-split-b', 1.22),
      mapMax: cssNum('--lg-ref-lens-map-max', 384),
      modalEnter: cssNum('--lg-modal-enter-scale', 0.94),
      fadeMs: cssNum('--lg-ref-duration-fade', 350)
    };
    /* variant lookup table — buildFilter 内分岐ではなく tokens 由来の表 */
    variants = {};
    ['regular', 'clear'].forEach(function (v) {
      var p = '--lg-material-' + v + '-';
      variants[v] = {
        falloffRatio: cssNum(p + 'falloff-ratio', 0.45),
        scaleRatio: cssNum(p + 'scale-ratio', 0.32),
        scaleMax: cssNum(p + 'scale-max', 44),
        scaleMin: cssNum(p + 'scale-min', 12),
        ca: cssNum(p + 'ca', 4),
        saturate: cssNum(p + 'saturate', 1.4),
        chainBlur: cssNum(p + 'chain-blur', 0)
      };
    });
  }
