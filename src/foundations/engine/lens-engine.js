  /* ============================================================
     displacement map — rounded-rect SDF 数値勾配 × convex squircle
     ⁴√(1-(1-x)⁴)。R/G = X/Y 変位、128 中立。エッジのみ屈折。
     geometry キャッシュ: w×h×r×falloff キーで再利用（LP 規模対応）。
     ============================================================ */
  function roundedSDF(px, py, hw, hh, r) {
    var qx = Math.abs(px) - (hw - r);
    var qy = Math.abs(py) - (hh - r);
    var ax = Math.max(qx, 0), ay = Math.max(qy, 0);
    return Math.min(Math.max(qx, qy), 0) + Math.hypot(ax, ay) - r; /* <0 inside */
  }

  var seedCounter = 0; /* 個体プール（4体）: 同一 geometry でも指紋が異なる */
  var mapCache = new Map();    /* key -> data URI */
  var filterCache = new Map(); /* key -> filter id */
  var defs = null, idc = 0;

  function makeMapURI(w, h, r, falloff, seed) {
    var ds = Math.min(1, tok.mapMax / Math.max(w, h)); /* downscale cap */
    var mw = Math.max(2, Math.round(w * ds));
    var mh = Math.max(2, Math.round(h * ds));
    var mr = r * ds;
    var mf = Math.max(2, falloff * ds);
    var key = mw + 'x' + mh + 'r' + Math.round(mr * 2) + 'f' + Math.round(mf * 2) + 's' + seed;
    var hit = mapCache.get(key);
    if (hit) return hit;

    var c = document.createElement('canvas');
    c.width = mw; c.height = mh;
    var ctx = c.getContext('2d');
    var img = ctx.createImageData(mw, mh);
    var d = img.data;
    var hw = mw / 2, hh = mh / 2, e = 0.75;
    var organic = cssNum('--lg-ref-lens-organic', 0);
    for (var y = 0; y < mh; y++) {
      for (var x = 0; x < mw; x++) {
        var px = x + 0.5 - hw, py = y + 0.5 - hh;
        var s = roundedSDF(px, py, hw, hh, mr);
        var dx = 0, dy = 0;
        if (s < 0) {
          var t = Math.min(-s / mf, 1);
          var height = Math.pow(1 - Math.pow(1 - t, 4), 0.25); /* convex squircle */
          var mag = 1 - height;                                 /* edge-only */
          /* 個体差（生命徴・R13）: 低周波の有機ノイズで屈折に一枚ごとの指紋を与える */
          if (organic > 0) {
            mag *= 1 + organic * Math.sin(px * 0.11 + seed * 7.3)
                               * Math.sin(py * 0.07 + seed * 3.1);
          }
          /* 境界ガード: 最外 2px は変位を 0 へ漸減。backdrop 読取りは要素境界で
             クリップされるため、境界ピクセルが外（透明）をサンプルすると
             チャネル分離 × screen 合成で色が湧く（マゼンタ縁アーティファクト） */
          if (-s < 2) mag *= -s / 2;
          if (mag > 0.002) {
            var nx = roundedSDF(px + e, py, hw, hh, mr) - roundedSDF(px - e, py, hw, hh, mr);
            var ny = roundedSDF(px, py + e, hw, hh, mr) - roundedSDF(px, py - e, hw, hh, mr);
            var len = Math.hypot(nx, ny) || 1;
            dx = (nx / len) * mag;
            dy = (ny / len) * mag;
          }
        }
        var i = (y * mw + x) * 4;
        d[i] = Math.round(128 + dx * 127);
        d[i + 1] = Math.round(128 + dy * 127);
        d[i + 2] = 128;
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    var uri = c.toDataURL('image/png');
    mapCache.set(key, uri);
    return uri;
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  var XLINK = 'http://www.w3.org/1999/xlink';
  function prim(name, attrs, parent) {
    var el = document.createElementNS(SVGNS, name);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    parent.appendChild(el);
    return el;
  }

  function ensureDefs() {
    if (defs) return;
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    defs = document.createElementNS(SVGNS, 'defs');
    svg.appendChild(defs);
    document.body.appendChild(svg);
  }

  /* filter 本体。同一 geometry × variant はフィルタごと共有する */
  function getFilterId(w, h, r, variantName, seed) {
    var V = variants[variantName];
    var falloff = Math.min(w, h) * V.falloffRatio;
    var fkey = w + 'x' + h + 'r' + Math.round(r) + 'v' + variantName + 's' + seed;
    var cached = filterCache.get(fkey);
    if (cached) return cached;

    var minDim = Math.min(w, h);
    var scale = Math.min(V.scaleMax, Math.max(V.scaleMin, minDim * V.scaleRatio));
    var ca = V.ca;
    var uri = makeMapURI(w, h, r, falloff, seed);
    var id = 'lg-lens-' + (idc++);

    var f = prim('filter', {
      id: id, x: '0', y: '0', width: '100%', height: '100%',
      'color-interpolation-filters': 'sRGB'
    }, defs);

    var img = prim('feImage', {
      x: '0', y: '0', width: w, height: h,
      preserveAspectRatio: 'none', result: 'map'
    }, f);
    img.setAttribute('href', uri);
    img.setAttributeNS(XLINK, 'xlink:href', uri);

    /* 分散: 変位比 R 0.86 / G 1.0 / B 1.22。実変位差は ±ca px に clamp
       （色収差はエッジ数 px の上限 — 公理1） */
    var chans = [
      ['dR', Math.max(scale - ca, scale * tok.caR),
        '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'],
      ['dG', scale, '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'],
      ['dB', Math.min(scale + ca, scale * tok.caB),
        '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0']
    ];

    chans.forEach(function (cn) {
      prim('feDisplacementMap', {
        'in': 'SourceGraphic', in2: 'map', scale: cn[1].toFixed(2),
        xChannelSelector: 'R', yChannelSelector: 'G', result: cn[0]
      }, f);
      prim('feColorMatrix', {
        'in': cn[0], type: 'matrix', values: cn[2], result: 'c' + cn[0]
      }, f);
    });
    prim('feBlend', { 'in': 'cdR', in2: 'cdG', mode: 'screen', result: 'rg' }, f);
    prim('feBlend', { 'in': 'rg', in2: 'cdB', mode: 'screen', result: 'rgb' }, f);
    /* 彩度リフトはチェーン内でも適用 — 値は tokens の CSS 変数から（単一ソース） */
    prim('feColorMatrix', { 'in': 'rgb', type: 'saturate', values: String(V.saturate) }, f);

    filterCache.set(fkey, id);
    return id;
  }

  function applyLens(el) {
    if (mode !== 'lens') return;
    ensureTokens();
    var rect = el.getBoundingClientRect();
    var w = Math.round(rect.width), h = Math.round(rect.height);
    if (w < 8 || h < 8) return; /* hidden — 表示時に refresh(el) で再適用 */
    ensureDefs();
    var cs = getComputedStyle(el);
    var r = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, Math.min(w, h) / 2);
    var variantName = el.dataset.lgVariant === 'clear' ? 'clear' : 'regular';
    var V = variants[variantName];
    var seed = el._lgSeed !== undefined ? el._lgSeed : (el._lgSeed = (seedCounter++ + obsSeedOffset) % 4);
    var id = getFilterId(w, h, r, variantName, seed);
    var post = '';
    if (V.chainBlur > 0) post += ' blur(' + V.chainBlur + 'px)';
    if (variantName === 'regular') post += ' brightness(var(--lg-bcomp))';
    el.style.backdropFilter = 'url(#' + id + ')' + post;
    el.style.webkitBackdropFilter = el.style.backdropFilter;
  }

  /* ---------- 応答する光学（R12）----------
     押すとレンズが潰れ、屈折・分散が物理的に弱まる。共有フィルタを
     初回押下時に要素専有へ複製し、変位スケール3枚をバネで駆動する。 */
  function ownFilter(el) {
    if (el._lgFx !== undefined) return el._lgFx;
    var m = (el.style.backdropFilter || '').match(/url\(["']?#(lg-lens-[\w-]+)/);
    if (!m) { el._lgFx = null; return null; }
    var orig = document.getElementById(m[1]);
    if (!orig) { el._lgFx = null; return null; }
    var clone = orig.cloneNode(true);
    var id = m[1] + '-fx-' + (idc++);
    clone.setAttribute('id', id);
    defs.appendChild(clone);
    el.style.backdropFilter = el.style.backdropFilter.replace('#' + m[1], '#' + id);
    el.style.webkitBackdropFilter = el.style.backdropFilter;
    var maps = clone.querySelectorAll('feDisplacementMap');
    var base = [];
    for (var i = 0; i < maps.length; i++) base.push(parseFloat(maps[i].getAttribute('scale')));
    el._lgFx = { maps: maps, base: base };
    return el._lgFx;
  }
  function makeOptics(el) {
    if (mode !== 'lens') return null;
    ensureTokens();
    var s = new Spring(1, tok.k * 0.9, tok.zeta * 0.85); /* ややアンダーダンプ = 揺り戻しで屈折が一度ゆらぐ */
    s.onUpdate = function (f) {
      var fx = el._lgFx;
      if (!fx) return;
      for (var i = 0; i < fx.maps.length; i++) {
        fx.maps[i].setAttribute('scale', (fx.base[i] * f).toFixed(2));
      }
    };
    return {
      to: function (f) { if (ownFilter(el)) s.set(f); }
    };
  }

  function rebuildAll() {
    readTokens(); /* テーマ切替（data-lg-theme）後の値変更を拾う */
    if (mode !== 'lens') return;
    if (defs) defs.textContent = '';
    idc = 0;
    mapCache.clear();
    filterCache.clear();
    document.querySelectorAll('.lg-glass').forEach(applyLens);
  }
