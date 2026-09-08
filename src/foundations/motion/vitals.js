
  /* ---------- 生命徴 vital signs（R13）----------
     瞳孔反射: hover でレンズがわずかに締まる（操作への応答・公理内）
     注視の呼吸: focus-visible の間だけリム強度がゆっくり往復
     （公理4の唯一の例外。apple-quiet では depth=0 で消灯） */
  function attachVitals(el) {
    if (el._lgVitals) return el._lgVitals;
    var optics = makeOptics(el); /* baseline では null */
    var st = { hover: false, press: false };
    function apply() {
      if (!optics) return;
      var pressF = cssNum('--lg-motion-gel-optics-press', 0.3);
      var hoverF = cssNum('--lg-motion-gel-optics-hover', 0.92);
      optics.to(st.press ? pressF : st.hover ? hoverF : 1);
    }
    el.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch') return; /* touch に hover は無い */
      st.hover = true; apply();
    });
    el.addEventListener('pointerleave', function () { st.hover = false; st.press = false; apply(); });
    document.addEventListener('scroll', function () { /* スクロールで hover が置き去り/未着になるのを防ぐ */
      var over = lgPointerOver(el);
      if (st.hover && !over) { st.hover = false; st.press = false; apply(); }
      else if (!st.hover && over && !st.press) { st.hover = true; apply(); }
    }, true);

    var breath = null;
    function startBreath() {
      if (breath || reduceMotion) return;
      var depth = cssNum('--lg-light-breath-depth', 0);
      if (depth <= 0) return;
      var period = cssNum('--lg-light-breath-period', 3600);
      var base = cssNum('--lg-light-hover-intensity', 0.8);
      var t0 = performance.now();
      breath = { step: function (dt, t) {
        var phase = ((t - t0) % period) / period;
        var li = base * (1 - depth * (0.5 + 0.5 * Math.sin(phase * 2 * Math.PI)));
        el.style.setProperty('--lg-li', li.toFixed(3));
        return false; /* focusout まで生きる */
      } };
      anims.add(breath);
      startRaf();
    }
    function stopBreath() {
      if (breath) { anims.delete(breath); breath = null; }
      el.style.removeProperty('--lg-li');
    }
    el.addEventListener('focusin', function () {
      try {
        if (el.matches(':focus-visible') || el.querySelector(':focus-visible')) startBreath();
      } catch (_) {}
    });
    el.addEventListener('focusout', stopBreath);

    var api = { press: function (on) { st.press = !!on; apply(); } };
    el._lgVitals = api;
    return api;
  }
