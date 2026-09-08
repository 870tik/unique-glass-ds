  /* ---------- command: ⌘K パレット ---------- */
  function command(backdropEl) {
    ensureTokens();
    var pane = backdropEl.querySelector('.lg-command');
    var input = backdropEl.querySelector('.lg-command-input');
    var empty = backdropEl.querySelector('.lg-command-empty');
    if (!pane || !input) return null;
    var s = springScale(pane, tok.modalEnter, tok.k * 0.85);
    var lastFocus = null;
    function allItems() {
      return Array.prototype.slice.call(backdropEl.querySelectorAll('.lg-command-item'));
    }
    function visItems() { return allItems().filter(function (i) { return !i.hidden; }); }
    function setActive(item) {
      allItems().forEach(function (i) { i.classList.toggle('is-active', i === item); });
      if (item && item.scrollIntoView) item.scrollIntoView({ block: 'nearest' });
    }
    function filter() {
      var q = (input.value || '').trim().toLowerCase();
      allItems().forEach(function (i) {
        i.hidden = q !== '' && i.textContent.toLowerCase().indexOf(q) === -1;
      });
      var vis = visItems();
      if (empty) empty.hidden = vis.length > 0;
      setActive(vis[0] || null);
    }
    function open() {
      lastFocus = document.activeElement;
      backdropEl.classList.add('is-open');
      backdropEl.setAttribute('aria-hidden', 'false');
      applyLens(pane);
      input.value = '';
      filter();
      s.x = tok.modalEnter; s.v = 0; s.set(1);
      input.focus();
    }
    function close() {
      backdropEl.classList.remove('is-open');
      backdropEl.setAttribute('aria-hidden', 'true');
      s.set(tok.modalEnter);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    input.addEventListener('input', filter);
    backdropEl.addEventListener('click', function (e) {
      if (e.target.closest('.lg-command-item')) close();
    });
    backdropEl.addEventListener('keydown', function (e) {
      var vis = visItems();
      var active = backdropEl.querySelector('.lg-command-item.is-active');
      var i = vis.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(vis[Math.min(i + 1, vis.length - 1)] || vis[0]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(vis[Math.max(i - 1, 0)] || vis[0]); }
      else if (e.key === 'Enter') { if (active) { active.click(); close(); } }
      else if (e.key === 'Escape') { e.stopPropagation(); close(); }
    });
    backdropEl.addEventListener('click', function (e) { if (e.target === backdropEl) close(); });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (backdropEl.classList.contains('is-open')) close(); else open();
      }
    });
    return { open: open, close: close, filter: filter };
  }
