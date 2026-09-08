  /* ---------- init ---------- */
  var resizeT = null;
  function onResize() {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      rebuildAll();
      document.querySelectorAll('.lg-nav, .lg-segmented, .lg-switch').forEach(function (n) {
        if (n._lgRelayout) n._lgRelayout();
      });
    }, 200);
  }

  function init() {
    readTokens();
    initObserver(); /* 観測者効果（R16）: レンズ生成より先に確定 */
    initPhysique(); /* 体質（R17）: gel/lens が読む前に trait を適用 */
    initSignals();  /* 環境信号（R18）: 太陽・傾き・バッテリー・懐き */
    document.querySelectorAll('.lg-glass').forEach(function (el) {
      applyLens(el);
      light(el);
      attachVitals(el);
      if (io) io.observe(el);
    });
    document.querySelectorAll('[data-lg-animate]').forEach(function (el) {
      if (io) io.observe(el);
    });
    document.querySelectorAll('[data-lg-gel]').forEach(function (el) {
      var press = parseFloat(el.dataset.lgGel);
      gel(el, isNaN(press) ? {} : { press: press });
    });
    /* 弾性は素材共通の物性（R14 補遺）: 操作できる塗り部品にも gel を標準搭載。
       光学（屈折・リム・呼吸）はガラスのみ = 二層の希少性は不変 */
    document.querySelectorAll(
      '.lg-chip, .lg-pagination-item, .lg-icon-button, .lg-select-trigger, ' +
      '.lg-step, .lg-shell-menu-btn'
    ).forEach(function (el) {
      if (el.dataset.lgGel === undefined) {
        gel(el, { press: cssNum('--lg-nav-tab-press-scale', 0.94) });
      }
    });
    document.querySelectorAll('.lg-nav').forEach(nav);
    document.querySelectorAll('.lg-segmented').forEach(nav);
    document.querySelectorAll('.lg-select:not(.lg-combobox)').forEach(select);
    document.querySelectorAll('.lg-combobox').forEach(combobox);
    document.querySelectorAll('.lg-backdrop--drawer').forEach(function (b) {
      if (!b._lgDrawer) drawer(b);
    });
    document.querySelectorAll('[data-lg-context]').forEach(function (t) {
      var p = document.querySelector(t.dataset.lgContext);
      if (p) contextMenu(t, p);
    });
    document.querySelectorAll('.lg-field--number').forEach(numberField);
    document.querySelectorAll('input[data-lg-datepicker]').forEach(datepicker);
    document.querySelectorAll('.lg-dropzone').forEach(dropzone);
    document.querySelectorAll('.lg-shell').forEach(shellNav);
    document.querySelectorAll('.lg-menu-anchor').forEach(function (el) {
      if (!el._lgMenu) menu(el);
    });
    document.querySelectorAll('.lg-backdrop--command').forEach(command);
    document.querySelectorAll('[data-lg-tooltip]').forEach(tooltip);
    document.querySelectorAll('.lg-switch').forEach(switchCtl);
    document.querySelectorAll('.lg-slider').forEach(slider);
    document.querySelectorAll('.lg-chip[aria-pressed]').forEach(chip);
    document.querySelectorAll('textarea.lg-field-input[data-lg-autosize]').forEach(autosize);
    document.querySelectorAll('.lg-banner').forEach(banner);
    document.querySelectorAll('.lg-progress').forEach(function (el) { progress(el); });
    window.addEventListener('resize', onResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', function () { rebuildAll(); });
