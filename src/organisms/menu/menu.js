  /* ---------- menu: トリガーからバネでモーフ入場、フェード退場 ---------- */
  var openMenus = [];
  function menu(anchorEl) {
    ensureTokens();
    var trigger = anchorEl.querySelector('button:not(.lg-menu-item), .lg-select-trigger');
    var panel = anchorEl.querySelector('.lg-menu');
    if (!trigger || !panel) return null;
    var enterScale = cssNum('--lg-menu-enter-scale', 0.65);
    var s = springScale(panel, enterScale, tok.k * 0.9);
    var isPopover = panel.classList.contains('lg-menu--popover');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('role', panel.getAttribute('role') || (isPopover ? 'dialog' : 'menu'));
    var isOpen = false;
    function items() {
      return Array.prototype.slice.call(panel.querySelectorAll('.lg-menu-item'))
        .filter(function (i) { return !i.hidden && !i.disabled; });
    }
    items().forEach(function (i) {
      if (!i.getAttribute('role')) i.setAttribute('role', 'menuitem');
    });
    function open() {
      if (isOpen) return;
      isOpen = true;
      panel.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      applyLens(panel);
      s.x = enterScale; s.v = 0; s.set(1);
      openMenus.push(api);
      var first = isPopover
        ? panel.querySelector('input, select, textarea, button, [tabindex]')
        : items()[0];
      if (first) first.focus();
    }
    function close(refocus) {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      s.set(enterScale);
      var ix = openMenus.indexOf(api);
      if (ix > -1) openMenus.splice(ix, 1);
      if (refocus) trigger.focus();
    }
    trigger.addEventListener('click', function () { if (isOpen) close(true); else open(); });
    panel.addEventListener('click', function (e) {
      if (!isPopover && e.target.closest('.lg-menu-item')) close(true);
    });
    panel.addEventListener('keydown', function (e) {
      var list = items();
      var i = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (list[i + 1] || list[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
    });
    var api = { open: open, close: close, el: anchorEl, panel: panel, trigger: trigger };
    anchorEl._lgMenu = api;
    return api;
  }
  document.addEventListener('pointerdown', function (e) {
    openMenus.slice().forEach(function (m) {
      if (!m.el.contains(e.target)) m.close(false);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openMenus.length) {
      openMenus[openMenus.length - 1].close(true);
    }
  });
