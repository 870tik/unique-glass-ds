  function progress(el, value) {
    if (value != null) el.dataset.lgValue = value;
    var v = parseFloat(el.dataset.lgValue);
    if (!isNaN(v)) el.style.setProperty('--lg-progress-val', Math.max(0, Math.min(100, v)) + '%');
    el.setAttribute('role', 'progressbar');
    if (!el.classList.contains('is-indeterminate')) {
      el.setAttribute('aria-valuemin', '0');
      el.setAttribute('aria-valuemax', '100');
      el.setAttribute('aria-valuenow', String(isNaN(v) ? 0 : v));
    }
  }

  /* ============================================================
     phase 5 — drawer / context menu / combobox / datepicker /
     number / dropzone / mobile shell
     ============================================================ */
