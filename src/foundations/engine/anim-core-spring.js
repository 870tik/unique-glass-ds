  /* ============================================================
     animation core — 共有 rAF。Spring(復帰) + press tween(1:1)。
     入力追従の粘性遅延はこの物質に存在しない（公理5）。
     ============================================================ */
  var anims = new Set();
  var rafOn = false, lastT = 0;
  function tick(t) {
    var dt = Math.min(1 / 30, (t - lastT) / 1000 || 1 / 60);
    lastT = t;
    anims.forEach(function (a) { if (a.step(dt, t)) anims.delete(a); });
    if (anims.size) requestAnimationFrame(tick);
    else rafOn = false;
  }
  function startRaf() {
    if (rafOn) return;
    rafOn = true;
    lastT = performance.now();
    requestAnimationFrame(tick);
  }

  function Spring(value, k, zeta) {
    this.x = value; this.v = 0; this.target = value;
    this.k = k; this.c = 2 * Math.sqrt(k) * zeta;
    this.onUpdate = null;
  }
  Spring.prototype.set = function (t) {
    this.target = t;
    if (reduceMotion) { /* snap */
      this.x = t; this.v = 0;
      if (this.onUpdate) this.onUpdate(t);
      return;
    }
    anims.add(this);
    startRaf();
  };
  Spring.prototype.step = function (dt) {
    var a = -this.k * (this.x - this.target) - this.c * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
    var settled = Math.abs(this.x - this.target) < 0.0004 && Math.abs(this.v) < 0.004;
    if (settled) { this.x = this.target; this.v = 0; }
    if (this.onUpdate) this.onUpdate(this.x);
    return settled;
  };
