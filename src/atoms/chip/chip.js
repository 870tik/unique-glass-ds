  /* ---------- chip: aria-pressed トグル ---------- */
  function chip(el) {
    el.addEventListener('click', function () {
      el.setAttribute('aria-pressed', String(el.getAttribute('aria-pressed') !== 'true'));
    });
  }
