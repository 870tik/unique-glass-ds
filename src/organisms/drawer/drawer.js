  /* ---------- drawer: 右からの一時面。translateX バネ入場 ---------- */
  function drawer(backdropEl) {
    ensureTokens();
    var pane = backdropEl.querySelector('.lg-drawer');
    var off = cssNum('--lg-drawer-enter-offset', 28);
    var s = new Spring(off, tok.k * 0.85, tok.zeta);
    s.onUpdate = function (x) { if (pane) pane.style.transform = 'translateX(' + x.toFixed(2) + 'px)'; };
    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      backdropEl.classList.add('is-open');
      backdropEl.setAttribute('aria-hidden', 'false');
      if (pane) {
        applyLens(pane);
        s.x = off; s.v = 0; s.set(0);
        var first = pane.querySelector('input, select, textarea, button, [tabindex]');
        if (first) first.focus();
      }
    }
    function close() {
      backdropEl.classList.remove('is-open');
      backdropEl.setAttribute('aria-hidden', 'true');
      s.set(off);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    backdropEl.addEventListener('click', function (e) { if (e.target === backdropEl) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdropEl.classList.contains('is-open')) close();
    });
    backdropEl._lgDrawer = { open: open, close: close };
    return backdropEl._lgDrawer;
  }
