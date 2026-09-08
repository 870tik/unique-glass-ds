  /* ---------- gel v2: Squash & Stretch + Follow-through（R14） ----------
     press = 1:1 の即応で「縦に潰れ横に伸びる」（体積保存の squash）
     release / hover = 低減衰バネ（wobble-zeta）でぷるんと揺れて到達する。
     カーソル追従の遅延は存在しない（公理5: 変形にだけ慣性がある） */
  function gel(el, opts) {
    ensureTokens();
    opts = opts || {};
    var squashY = opts.press != null ? opts.press : cssNum('--lg-motion-gel-squash-y', 0.9);
    /* 体積保存: opts.press（部品の1ノブ）からも横伸びを自動導出 */
    var stretchX = opts.press != null
      ? 1 + (1 - opts.press) * 0.7
      : cssNum('--lg-motion-gel-stretch-x', 1.06);
    var hoverS = cssNum('--lg-motion-gel-hover-scale', 1.03);
    var wobble = cssNum('--lg-motion-gel-wobble-zeta', 0.42);
    var k = opts.k || tok.k;

    var sx = new Spring(1, k, wobble);
    var sy = new Spring(1, k, wobble);
    function paint() {
      el.style.transform = 'scale(' + sx.x.toFixed(4) + ', ' + sy.x.toFixed(4) + ')';
    }
    sx.onUpdate = paint;
    sy.onUpdate = paint;

    var st = { hover: false, press: false };
    var pressAnim = null;
    var vit = attachVitals(el);

    function targets() {
      if (st.press) return [stretchX, squashY];
      if (st.hover) return [hoverS, hoverS];
      return [1, 1];
    }
    function settle() { /* バネで（揺れながら）目標へ */
      var t = targets();
      sx.set(t[0]);
      sy.set(t[1]);
    }
    function doPress() { /* 押下だけは 1:1 の即応（バネを使わない） */
      anims.delete(sx); anims.delete(sy);
      if (pressAnim) anims.delete(pressAnim);
      var tx = stretchX, ty = squashY;
      if (reduceMotion) {
        sx.x = sx.target = tx; sy.x = sy.target = ty;
        sx.v = sy.v = 0; paint();
        return;
      }
      var fx = sx.x, fy = sy.x, t0 = performance.now(), ms = tok.pressMs;
      pressAnim = {
        step: function () {
          var p = Math.min(1, (performance.now() - t0) / ms);
          var e = 1 - Math.pow(1 - p, 3);
          sx.x = fx + (tx - fx) * e; sx.v = 0;
          sy.x = fy + (ty - fy) * e; sy.v = 0;
          paint();
          return p >= 1;
        }
      };
      anims.add(pressAnim);
      startRaf();
    }

    el.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch') return; /* touch に hover は無い（離した後の残留を防ぐ） */
      st.hover = true; if (!st.press) settle();
    });
    el.addEventListener('pointerleave', function () { st.hover = false; st.press = false; settle(); });
    /* 祖先のスクロールでは pointerleave/enter が発火せず、:hover の再計算も
       次の mousemove まで走らないことがある（Chrome）。実ヒットテストで判定し、
       流れ出た要素の hover を解除し、流れ込んできた要素へ hover を移す */
    document.addEventListener('scroll', function () {
      var over = lgPointerOver(el);
      if (st.hover && !over) { st.hover = false; st.press = false; settle(); }
      else if (!st.hover && over && !st.press) { st.hover = true; settle(); }
    }, true);
    el.addEventListener('pointerdown', function (e) {
      if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (_) {} }
      st.press = true;
      doPress();
      vit.press(true);
    });
    function release() {
      st.press = false;
      if (pressAnim) { anims.delete(pressAnim); pressAnim = null; }
      settle(); /* 低減衰 → ぷるんと揺れて戻る（follow-through） */
      vit.press(false);
    }
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('lostpointercapture', release);
    el.addEventListener('keydown', function (e) {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { st.press = true; doPress(); vit.press(true); }
    });
    el.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Enter') release();
    });
    return { sx: sx, sy: sy };
  }
