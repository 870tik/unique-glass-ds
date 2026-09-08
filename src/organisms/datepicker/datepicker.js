  /* ---------- datepicker: input[data-lg-datepicker] に popover カレンダー ---------- */
  function datepicker(input) {
    ensureTokens();
    var panel = document.createElement('div');
    panel.className = 'lg-glass lg-menu lg-menu--context lg-datepicker';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '日付を選択');
    document.body.appendChild(panel);
    var enterScale = cssNum('--lg-menu-enter-scale', 0.65);
    var s = springScale(panel, enterScale, tok.k * 0.9);
    var view = new Date();
    var isOpen = false;
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function fmt(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
    function render() {
      var y = view.getFullYear(), m = view.getMonth();
      var sel = input.value, today = fmt(new Date());
      var start = (new Date(y, m, 1).getDay() + 6) % 7; /* 月曜始まり */
      var ic = function (n, fb) {
        return window.LGIcons ? window.LGIcons.svg(n) : fb;
      };
      var html = '<div class="lg-datepicker-head">' +
        '<button class="lg-step" data-nav="-1" aria-label="前の月">' + ic('chevron-left', '‹') + '</button>' +
        '<span>' + y + '年' + (m + 1) + '月</span>' +
        '<button class="lg-step" data-nav="1" aria-label="次の月">' + ic('chevron-right', '›') + '</button></div>' +
        '<div class="lg-datepicker-grid">';
      ['月', '火', '水', '木', '金', '土', '日'].forEach(function (d) {
        html += '<span class="dow">' + d + '</span>';
      });
      for (var i = 0; i < 42; i++) {
        var d = new Date(y, m, i - start + 1);
        var ds = fmt(d);
        html += '<button class="day' + (d.getMonth() !== m ? ' is-out' : '') +
          (ds === today ? ' is-today' : '') + '" data-date="' + ds + '"' +
          ' aria-selected="' + (ds === sel) + '">' + d.getDate() + '</button>';
      }
      panel.innerHTML = html + '</div>';
      panel.querySelectorAll('.lg-step').forEach(function (b) {
        gel(b, { press: cssNum('--lg-nav-tab-press-scale', 0.94) });
      });
    }
    function position() {
      var anchor = input.closest('.lg-field') || input;
      var r = anchor.getBoundingClientRect();
      panel.style.left = '0px'; panel.style.top = '0px';
      var w = panel.offsetWidth, h = panel.offsetHeight;
      var x = Math.max(8, Math.min(r.left, innerWidth - w - 8));
      var y = r.bottom + 6;
      if (y + h > innerHeight - 8) y = Math.max(8, r.top - h - 6);
      panel.style.left = x.toFixed(0) + 'px';
      panel.style.top = y.toFixed(0) + 'px';
    }
    function open() {
      if (isOpen) return;
      isOpen = true;
      if (input.value) {
        var p = input.value.split('-');
        if (p.length === 3) view = new Date(+p[0], +p[1] - 1, 1);
      }
      render();
      position();
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
    input.addEventListener('focus', open);
    input.addEventListener('click', open);
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    panel.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-nav]');
      if (nav) {
        view.setMonth(view.getMonth() + parseInt(nav.dataset.nav, 10));
        render();
        return;
      }
      var day = e.target.closest('.day');
      if (day) {
        input.value = day.dataset.date;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new CustomEvent('lg-change', { detail: { value: day.dataset.date } }));
        close();
      }
    });
    document.addEventListener('pointerdown', function (e) {
      if (isOpen && !panel.contains(e.target) && e.target !== input) close();
    });
    return { open: open, close: close };
  }
