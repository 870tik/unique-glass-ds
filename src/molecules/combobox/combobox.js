  /* ---------- combobox: 入力でフィルタする select ---------- */
  function combobox(el) {
    ensureTokens();
    var input = el.querySelector('.lg-field-input');
    var panel = el.querySelector('.lg-menu');
    if (!input || !panel) return null;
    panel.setAttribute('role', 'listbox');
    var enterScale = cssNum('--lg-menu-enter-scale', 0.65);
    var s = springScale(panel, enterScale, tok.k * 0.9);
    var isOpen = false;
    function opts() { return Array.prototype.slice.call(panel.querySelectorAll('.lg-menu-item')); }
    function filter() {
      var q = input.value.trim().toLowerCase();
      opts().forEach(function (o) {
        o.hidden = q !== '' && o.textContent.toLowerCase().indexOf(q) === -1;
      });
    }
    function open() {
      if (isOpen) return;
      isOpen = true;
      applyLens(panel);
      panel.classList.add('is-open');
      s.x = enterScale; s.v = 0; s.set(1);
    }
    function close() {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('is-open');
      s.set(enterScale);
    }
    function pick(o) {
      input.value = o.dataset.lgLabel || o.textContent.trim();
      el.dispatchEvent(new CustomEvent('lg-change', {
        detail: { value: o.dataset.lgValue != null ? o.dataset.lgValue : input.value }
      }));
      close();
    }
    input.addEventListener('focus', function () { filter(); open(); });
    input.addEventListener('input', function () { filter(); open(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      else if (e.key === 'Enter' && isOpen) {
        var first = opts().filter(function (o) { return !o.hidden; })[0];
        if (first) { e.preventDefault(); pick(first); }
      }
    });
    panel.addEventListener('click', function (e) {
      var o = e.target.closest('.lg-menu-item');
      if (o) pick(o);
    });
    document.addEventListener('pointerdown', function (e) {
      if (isOpen && !el.contains(e.target)) close();
    });
    return { open: open, close: close };
  }
