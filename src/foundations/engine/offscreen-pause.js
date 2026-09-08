  /* ---------- offscreen pause ---------- */
  var io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          en.target.classList.toggle('lg-offscreen', !en.isIntersecting);
        });
      }, { rootMargin: '96px' })
    : null;
