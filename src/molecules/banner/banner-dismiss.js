  function banner(el) {
    var close = el.querySelector('.lg-banner-close');
    if (!close) return;
    close.addEventListener('click', function () {
      el.classList.add('is-leaving');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, tok.fadeMs + 40);
    });
  }
