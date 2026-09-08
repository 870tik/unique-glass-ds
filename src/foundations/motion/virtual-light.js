  /* ---------- virtual light: 角度はポインタ 1:1 直結。強度は CSS が遷移 ---------- */
  function light(el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      var deg = Math.atan2(dy, dx) * 180 / Math.PI + 90; /* css conic: 0 = up */
      el.style.setProperty('--lg-la', deg.toFixed(1) + 'deg');
    });
  }
