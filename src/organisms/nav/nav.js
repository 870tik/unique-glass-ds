  /* ---------- nav: sprung pill（横 / 縦 lg-nav--vertical / lg-segmented 共用） ---------- */
  function nav(navEl) {
    ensureTokens();
    var pill = navEl.querySelector('.lg-nav-pill');
    var tabs = Array.prototype.slice.call(navEl.querySelectorAll('.lg-tab'));
    if (!tabs.length) return;
    if (!pill) { /* ピルは自動生成（マークアップ簡略化） */
      pill = document.createElement('span');
      pill.className = 'lg-nav-pill';
      pill.setAttribute('aria-hidden', 'true');
      navEl.insertBefore(pill, navEl.firstChild);
    }
    var vertical = navEl.classList.contains('lg-nav--vertical');
    var sx = new Spring(0, tok.k * 0.75, Math.min(0.75, tok.zeta + 0.05));
    var sw = new Spring(0, tok.k * 0.75, Math.min(0.8, tok.zeta + 0.1));
    sx.onUpdate = function (x) {
      pill.style.transform = (vertical ? 'translateY(' : 'translateX(') + x.toFixed(2) + 'px)';
    };
    sw.onUpdate = function (w) {
      pill.style[vertical ? 'height' : 'width'] = w.toFixed(2) + 'px';
    };
    function move(tab, instant) {
      var x = vertical ? tab.offsetTop : tab.offsetLeft;
      var w = vertical ? tab.offsetHeight : tab.offsetWidth;
      if (instant || reduceMotion) {
        sx.x = sx.target = x; sw.x = sw.target = w;
        sx.onUpdate(x); sw.onUpdate(w);
      } else { sx.set(x); sw.set(w); }
    }
    function syncPanels() {
      tabs.forEach(function (t) {
        var pid = t.getAttribute('aria-controls');
        if (!pid) return;
        var p = document.getElementById(pid);
        if (p) {
          p.setAttribute('role', 'tabpanel');
          p.hidden = t.getAttribute('aria-selected') !== 'true';
        }
      });
    }
    tabs.forEach(function (tab) {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', String(t === tab));
        });
        syncPanels();
        move(tab, false);
      });
      gel(tab, { press: cssNum('--lg-nav-tab-press-scale', 0.94), k: tok.k * 1.15 });
    });
    var active = navEl.querySelector('.lg-tab[aria-selected="true"]') || tabs[0];
    active.setAttribute('aria-selected', 'true');
    syncPanels();
    move(active, true);
    navEl._lgRelayout = function () { move(navEl.querySelector('.lg-tab[aria-selected="true"]') || tabs[0], true); };
  }
