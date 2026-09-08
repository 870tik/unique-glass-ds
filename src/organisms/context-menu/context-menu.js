  /* ---------- context menu: カーソル位置に開く（右クリック結合） ---------- */
  function contextMenu(target, panel) {
    ensureTokens();
    var enterScale = cssNum('--lg-menu-enter-scale', 0.65);
    var s = springScale(panel, enterScale, tok.k * 0.9);
    var isOpen = false;
    function close() {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('is-open');
      s.set(enterScale);
    }
    function openAt(x, y) {
      applyLens(panel);
      var w = panel.offsetWidth || 208, h = panel.offsetHeight || 40;
      panel.style.left = Math.max(8, Math.min(x, innerWidth - w - 8)) + 'px';
      panel.style.top = Math.max(8, Math.min(y, innerHeight - h - 8)) + 'px';
      panel.classList.add('is-open');
      isOpen = true;
      s.x = enterScale; s.v = 0; s.set(1);
    }
    target.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      openAt(e.clientX, e.clientY);
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('.lg-menu-item')) close();
    });
    document.addEventListener('pointerdown', function (e) {
      if (isOpen && !panel.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    return { openAt: openAt, close: close };
  }
