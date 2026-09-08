  /* ---------- switch: ノブは gel バネで滑走。操作中ガラス化は CSS 側 ---------- */
  function switchCtl(switchEl) {
    ensureTokens();
    var input = switchEl.querySelector('input');
    var track = switchEl.querySelector('.lg-switch-track');
    var knob = switchEl.querySelector('.lg-switch-knob');
    if (!input || !track || !knob) return;
    var s = new Spring(0, tok.k * 1.1, tok.zeta);
    s.onUpdate = function (x) { knob.style.transform = 'translateX(' + x.toFixed(2) + 'px)'; };
    function travel() { return track.offsetWidth - track.offsetHeight; }
    function sync(instant) {
      var x = input.checked ? travel() : 0;
      if (instant || reduceMotion) { s.x = s.target = x; s.v = 0; s.onUpdate(x); }
      else s.set(x);
    }
    input.addEventListener('change', function () { sync(false); });
    sync(true);
    switchEl._lgRelayout = function () { sync(true); };
  }
