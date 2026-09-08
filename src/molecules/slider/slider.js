  /* ---------- slider: 値は 1:1（追従遅延なし）。塗り位置を CSS 変数へ ---------- */
  function slider(el) {
    function sync() {
      var min = parseFloat(el.min) || 0;
      var max = isNaN(parseFloat(el.max)) ? 100 : parseFloat(el.max);
      var p = ((parseFloat(el.value) - min) / (max - min || 1)) * 100;
      el.style.setProperty('--lg-slider-val', p.toFixed(2) + '%');
    }
    el.addEventListener('input', sync);
    sync();
  }
