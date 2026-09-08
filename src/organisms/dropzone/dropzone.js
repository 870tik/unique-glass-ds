  /* ---------- dropzone: drag over の間だけガラス化。lg-files イベント発火 ---------- */
  function dropzone(zone) {
    var input = zone.querySelector('input[type="file"]');
    var files = zone.querySelector('.files');
    if (!zone.hasAttribute('tabindex')) zone.setAttribute('tabindex', '0');
    zone.setAttribute('role', 'button');
    function setFiles(list) {
      if (files) {
        files.textContent = Array.prototype.map.call(list, function (f) { return f.name; }).join(' / ');
      }
      zone.dispatchEvent(new CustomEvent('lg-files', { detail: { files: list } }));
    }
    zone.addEventListener('click', function () { if (input) input.click(); });
    zone.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && input) { e.preventDefault(); input.click(); }
    });
    if (input) input.addEventListener('change', function () { setFiles(input.files); });
    ['dragenter', 'dragover'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('is-over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('is-over'); });
    });
    zone.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files.length) setFiles(e.dataTransfer.files);
    });
  }
