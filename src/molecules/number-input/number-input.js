  /* ---------- number input: ステッパーボタン。min/max/step を尊重 ---------- */
  function numberField(fieldEl) {
    var input = fieldEl.querySelector('.lg-field-input');
    if (!input) return;
    fieldEl.querySelectorAll('.lg-step').forEach(function (b) {
      b.addEventListener('click', function () {
        var step = (parseFloat(input.step) || 1) * (parseFloat(b.dataset.step) || 1);
        var v = (parseFloat(input.value) || 0) + step;
        if (input.min !== '') v = Math.max(v, parseFloat(input.min));
        if (input.max !== '') v = Math.min(v, parseFloat(input.max));
        var dec = (String(input.step).split('.')[1] || '').length;
        input.value = v.toFixed(dec);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }
