  /* ---------- toast: 右下スタック。入場バネ・退場フェード・hover で滞留 ---------- */
  var toastStack = null;
  function toast(msg, opts) {
    ensureTokens();
    opts = opts || {};
    if (!toastStack) {
      toastStack = document.createElement('div');
      toastStack.className = 'lg-toast-stack';
      toastStack.setAttribute('role', 'status');
      toastStack.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastStack);
    }
    var t = document.createElement('div');
    t.className = 'lg-toast lg-glass' + (opts.positive ? ' is-positive' : '');
    if (opts.surface) t.setAttribute('data-lg-surface', opts.surface);
    var span = document.createElement('span');
    span.textContent = msg;
    t.appendChild(span);
    var timer = null;
    var remain = cssNum('--lg-ref-duration-toast', 4200);
    var t0 = 0;
    function dismiss() {
      clearTimeout(timer); timer = null;
      t.classList.add('is-leaving');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, tok.fadeMs + 40);
    }
    function schedule(ms) { t0 = Date.now(); timer = setTimeout(dismiss, ms); }
    if (opts.action) {
      var b = document.createElement('button');
      b.className = 'lg-toast-action';
      b.textContent = opts.action;
      gel(b, { press: cssNum('--lg-nav-tab-press-scale', 0.94) });
      b.addEventListener('click', function () {
        if (opts.onAction) opts.onAction();
        dismiss();
      });
      t.appendChild(b);
    }
    while (toastStack.children.length >= 4) toastStack.removeChild(toastStack.firstChild);
    toastStack.appendChild(t);
    applyLens(t);
    light(t);
    var s = new Spring(1, tok.k * 0.9, tok.zeta);
    s.onUpdate = function (x) {
      t.style.transform = 'translateY(' + (x * 14).toFixed(2) + 'px) scale(' + (1 - 0.04 * x).toFixed(4) + ')';
    };
    s.set(0);
    t.addEventListener('pointerenter', function () {
      if (timer) { clearTimeout(timer); remain = Math.max(1200, remain - (Date.now() - t0)); timer = null; }
    });
    t.addEventListener('pointerleave', function () { if (!timer && !t.classList.contains('is-leaving')) schedule(remain); });
    if (opts.sticky !== true) schedule(remain);
    return { dismiss: dismiss, el: t };
  }
