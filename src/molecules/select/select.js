  /* ---------- select: menu を土台にした単一選択 ---------- */
  function select(selectEl) {
    var api = menu(selectEl);
    if (!api) return null;
    api.panel.setAttribute('role', 'listbox');
    var label = selectEl.querySelector('.lg-select-label');
    var opts = Array.prototype.slice.call(api.panel.querySelectorAll('.lg-menu-item'));
    opts.forEach(function (o) {
      o.setAttribute('role', 'option');
      if (!o.hasAttribute('aria-selected')) o.setAttribute('aria-selected', 'false');
      o.addEventListener('click', function () {
        opts.forEach(function (x) { x.setAttribute('aria-selected', String(x === o)); });
        if (label) label.textContent = o.dataset.lgLabel || o.textContent.trim();
        selectEl.dispatchEvent(new CustomEvent('lg-change', {
          detail: { value: o.dataset.lgValue != null ? o.dataset.lgValue : o.textContent.trim() }
        }));
      });
    });
    return api;
  }
