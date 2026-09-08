  /* ---------- phase 4: textarea autosize / banner dismiss / progress ---------- */
  function autosize(ta) {
    function sync() {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
    ta.addEventListener('input', sync);
    sync();
  }
