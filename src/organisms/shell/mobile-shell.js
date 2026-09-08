  /* ---------- mobile shell: サイドバーのオフキャンバス開閉 ---------- */
  function shellNav(shell) {
    shell.querySelectorAll('.lg-shell-menu-btn, [data-lg-shell-toggle]').forEach(function (b) {
      b.addEventListener('click', function () { shell.classList.toggle('is-nav-open'); });
    });
    /* mobile: 明示的な閉じるボタンをサイドバーへ注入（scrim/Esc に加えて） */
    var sb = shell.querySelector('.lg-sidebar');
    if (sb && !sb.querySelector('.lg-shell-close')) {
      var c = document.createElement('button');
      c.className = 'lg-shell-close';
      c.setAttribute('aria-label', 'メニューを閉じる');
      c.innerHTML = window.LGIcons ? LGIcons.svg('x') : '\u2715';
      c.addEventListener('click', function () { shell.classList.remove('is-nav-open'); });
      sb.appendChild(c);
    }
    shell.addEventListener('click', function (e) {
      if (e.target === shell && shell.classList.contains('is-nav-open')) {
        shell.classList.remove('is-nav-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') shell.classList.remove('is-nav-open');
    });
  }
