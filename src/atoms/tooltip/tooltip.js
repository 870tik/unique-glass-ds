  /* ---------- tooltip: 遅延表示・位置固定（ポインタ非追従） ---------- */
  var tipEl = null, tipTimer = null, tipTarget = null;
  function ensureTip() {
    if (tipEl) return tipEl;
    tipEl = document.createElement('div');
    tipEl.className = 'lg-tooltip';
    tipEl.id = 'lg-tooltip';
    tipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tipEl);
    return tipEl;
  }
  function showTip(target) {
    var el = ensureTip();
    el.textContent = target.getAttribute('data-lg-tooltip') || '';
    el.classList.remove('is-open');
    el.style.left = '0px'; el.style.top = '0px';
    var r = target.getBoundingClientRect();
    var tw = el.offsetWidth, th = el.offsetHeight;
    var x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), innerWidth - tw - 8);
    var y = r.top - th - 8;
    if (y < 8) y = r.bottom + 8;
    el.style.left = x.toFixed(0) + 'px';
    el.style.top = y.toFixed(0) + 'px';
    el.classList.add('is-open');
    target.setAttribute('aria-describedby', 'lg-tooltip');
    tipTarget = target;
  }
  function hideTip() {
    clearTimeout(tipTimer); tipTimer = null;
    if (tipEl) tipEl.classList.remove('is-open');
    if (tipTarget) { tipTarget.removeAttribute('aria-describedby'); tipTarget = null; }
  }
  function tooltip(target) {
    function arm() {
      clearTimeout(tipTimer);
      tipTimer = setTimeout(function () { showTip(target); },
        cssNum('--lg-ref-duration-tooltip-delay', 450));
    }
    target.addEventListener('pointerenter', arm);
    target.addEventListener('focus', arm);
    target.addEventListener('pointerleave', hideTip);
    target.addEventListener('blur', hideTip);
    target.addEventListener('pointerdown', hideTip);
  }
  window.addEventListener('scroll', hideTip, true);
