  /* ---------- modal: gel 開閉 + scrim ---------- */
  function modal(backdropEl) {
    ensureTokens();
    var pane = backdropEl.querySelector('.lg-modal');
    var s = new Spring(tok.modalEnter, tok.k * 0.85, tok.zeta);
    s.onUpdate = function (x) { if (pane) pane.style.transform = 'scale(' + x.toFixed(4) + ')'; };
    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      backdropEl.classList.add('is-open');
      backdropEl.setAttribute('aria-hidden', 'false');
      if (pane) {
        applyLens(pane); /* 非表示中に測れなかった場合の保険 */
        s.x = tok.modalEnter; s.v = 0;
        s.set(1);
        pane.focus && pane.focus();
      }
    }
    function close() {
      backdropEl.classList.remove('is-open');
      backdropEl.setAttribute('aria-hidden', 'true');
      s.set(tok.modalEnter);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    backdropEl.addEventListener('click', function (e) {
      if (e.target === backdropEl) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdropEl.classList.contains('is-open')) close();
    });
    return { open: open, close: close };
  }

  /* ============================================================
     phase 3 — SaaS parts: menu / select / command / toast /
     tooltip / switch / slider / chip。
     すべて既存物理を共有: 入場はバネ、退場はフェード、追従は 1:1。
     ============================================================ */

  function springScale(el, from, k, zeta) {
    var s = new Spring(from, k || tok.k * 0.85, zeta || tok.zeta);
    s.onUpdate = function (x) { el.style.transform = 'scale(' + x.toFixed(4) + ')'; };
    return s;
  }
