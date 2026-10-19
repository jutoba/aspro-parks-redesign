// Simulador en primera persona (canvas 2D con proyección en perspectiva).
// Tres atracciones: tobogán de tubo, montaña rusa y túnel de acuario.
(function () {
  var RIDES = {
    slide: { label: 'Tobogán', color: '#1478B8', cta: 'Tírate', aria: 'Simulación en primera persona bajando por un tobogán de tubo' },
    coaster: { label: 'Montaña rusa', color: '#C2410C', cta: 'Súbete', aria: 'Simulación en primera persona en una montaña rusa' },
    aqua: { label: 'Túnel del acuario', color: '#0E5E7A', cta: 'Entra', aria: 'Simulación en primera persona caminando por un túnel submarino con peces' }
  };
  var $ = function (id) { return document.getElementById(id); };
  var canvas = $('ride'), stage = $('stage');
  var S = { ride: 'slide', playing: false, t: 0, speed: 0, dt: 0,
    look: { x: 0, y: 0 }, lookT: { x: 0, y: 0 }, fish: [] };

  // UI
  var ridesEl = $('rides');
  Object.keys(RIDES).forEach(function (id) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.id = id; b.textContent = RIDES[id].label;
    b.addEventListener('click', function () { pickRide(id); });
    ridesEl.appendChild(b);
  });
  $('play').addEventListener('click', function () { setPlaying(true); });
  $('pause').addEventListener('click', function () { setPlaying(false); });
  stage.addEventListener('pointermove', function (e) {
    var r = stage.getBoundingClientRect();
    S.lookT.x = (e.clientX - r.left) / r.width - 0.5;
    S.lookT.y = (e.clientY - r.top) / r.height - 0.5;
  });
  stage.addEventListener('pointerleave', function () { S.lookT.x = 0; S.lookT.y = 0; });

  function pickRide(id) {
    S.ride = id; S.t = 0; S.speed = 0;
    resetFish();
    setPlaying(true);
  }
  function setPlaying(p) { S.playing = p; renderUI(); }
  function renderUI() {
    var r = RIDES[S.ride];
    Array.prototype.forEach.call(ridesEl.children, function (b) {
      var on = b.dataset.id === S.ride;
      b.setAttribute('aria-pressed', on);
      b.style.background = on ? RIDES[b.dataset.id].color : '#FFF6E9';
      b.style.color = on ? '#fff' : '#10233F';
    });
    $('ride-tag').textContent = 'POV · ' + r.label;
    $('cta').textContent = r.cta;
    $('play').setAttribute('aria-label', r.cta);
    canvas.setAttribute('aria-label', r.aria);
    $('overlay').hidden = S.playing;
    $('pause').hidden = !S.playing;
  }

  // Motor
  function resetFish() { S.fish = []; for (var i = 0; i < 30; i++) S.fish.push(newFish(1 + Math.random() * 28)); }
  function newFish(ahead) {
    var cols = ['#FF8A3D', '#F2C14E', '#E8EEF2', '#FF6B6B', '#9AD1F5', '#F7F7F2'];
    return { s: S.t + ahead, a: Math.random() * Math.PI * 1.3 - Math.PI * 1.15,
      r: 1.6 + Math.random() * 1.8, v: 0.2 + Math.random() * 0.7,
      c: cols[Math.floor(Math.random() * cols.length)], ph: Math.random() * 6, big: Math.random() < 0.08 };
  }
  function px(s) { return Math.sin(s * 0.21) * 1.6 + Math.sin(s * 0.083 + 2) * 2.2; }
  function py(s) { return Math.sin(s * 0.17 + 1) * 0.9; }
  function cH(s) { return Math.sin(s * 0.16) * 3.2 + Math.sin(s * 0.061 + 1) * 2.4 + 6; }
  function cX(s) { return Math.sin(s * 0.09) * 5 + Math.sin(s * 0.037) * 4; }
  function mix(c, f, k) { return 'rgb(' + Math.round(c[0] * (1 - k) + f[0] * k) + ',' + Math.round(c[1] * (1 - k) + f[1] * k) + ',' + Math.round(c[2] * (1 - k) + f[2] * k) + ')'; }
  function coasterSpeed() {
    var slope = (cH(S.t + 0.05) - cH(S.t)) / 0.05;
    return Math.max(3, Math.min(15, 7 - slope * 9));
  }

  function step(dt) {
    var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S.dt = dt;
    var base = S.ride === 'aqua' ? 1.8 : S.ride === 'slide' ? 7.5 : coasterSpeed();
    var target = S.playing ? base : 0;
    S.speed += (target - S.speed) * Math.min(1, dt * 1.6);
    S.t += S.speed * dt;
    S.look.x += (S.lookT.x - S.look.x) * Math.min(1, dt * 4);
    S.look.y += (S.lookT.y - S.look.y) * Math.min(1, dt * 4);
    if (S.ride === 'coaster') drawCoaster(ctx, w, h); else drawTube(ctx, w, h, S.ride === 'aqua');
    var g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + (0.25 + Math.min(0.25, S.speed * 0.02)) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  function drawTube(ctx, w, h, aqua) {
    var f = h * 0.85, t = S.t, d = 0.5, N = 48, M = 18, TAU = Math.PI * 2;
    var dx = (px(t + 0.01) - px(t)) / 0.01, dy = (py(t + 0.01) - py(t)) / 0.01;
    var ddx = (px(t + 0.5) - 2 * px(t) + px(t - 0.5)) / 0.25;
    var oy = aqua ? -0.15 : -0.4;
    var roll = aqua ? 0 : Math.max(-0.6, Math.min(0.6, -ddx * 1.4));
    var fogC = aqua ? [6, 40, 62] : [255, 246, 233];
    ctx.save();
    ctx.translate(w / 2 - S.look.x * w * 0.3, h / 2 - S.look.y * h * 0.25);
    ctx.rotate(roll);
    if (aqua) {
      var bg = ctx.createLinearGradient(0, -h, 0, h);
      bg.addColorStop(0, '#3FA7D6'); bg.addColorStop(0.45, '#126A96'); bg.addColorStop(1, '#04253A');
      ctx.fillStyle = bg; ctx.fillRect(-w * 1.5, -h * 1.5, w * 3, h * 3);
      for (var q = 0; q < 6; q++) {
        var xr = Math.sin(t * 0.05 + q * 1.7) * w * 0.6;
        ctx.fillStyle = 'rgba(255,255,255,' + (0.04 + 0.03 * Math.sin(t * 0.3 + q)) + ')';
        ctx.beginPath(); ctx.moveTo(xr - 40, -h * 1.2); ctx.lineTo(xr + 40, -h * 1.2); ctx.lineTo(xr * 0.2 + 18, h * 0.2); ctx.lineTo(xr * 0.2 - 6, h * 0.2); ctx.fill();
      }
    } else {
      ctx.fillStyle = 'rgb(' + fogC + ')'; ctx.fillRect(-w * 1.5, -h * 1.5, w * 3, h * 3);
    }
    var k0 = Math.floor(t / d) + 1, rings = [];
    for (var i = 0; i < N; i++) {
      var s = (k0 + i) * d, z = Math.max(0.08, s - t), sc = f / z;
      rings.push({ k: k0 + i, z: z, sc: sc, x: (px(s) - px(t) - dx * z) * sc, y: (py(s) - py(t) - dy * z - oy) * sc });
    }
    var maxZ = N * d;
    if (aqua) {
      for (var a = 0; a < S.fish.length; a++) {
        S.fish[a].s += S.fish[a].v * S.dt;
        if (S.fish[a].s - t < 0.5) S.fish[a] = newFish(20 + Math.random() * 8);
      }
      S.fish.slice().sort(function (p, q2) { return q2.s - p.s; }).forEach(function (fi) {
        var z2 = fi.s - t; if (z2 > maxZ) return;
        var sc2 = f / z2, fog2 = Math.min(1, z2 / 22);
        var x2 = (Math.cos(fi.a) * fi.r + px(fi.s) - px(t) - dx * z2) * sc2;
        var y2 = (Math.sin(fi.a) * fi.r + py(fi.s) - py(t) - dy * z2 - oy) * sc2;
        var L = (fi.big ? 0.9 : 0.2) * sc2, wig = Math.sin(t * 6 + fi.ph) * 0.25;
        ctx.globalAlpha = Math.max(0, 1 - fog2);
        ctx.fillStyle = fi.big ? '#5B6B78' : fi.c;
        ctx.beginPath(); ctx.ellipse(x2, y2, L, L * 0.42, wig * 0.3, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x2 - L * 0.8, y2); ctx.lineTo(x2 - L * 1.5, y2 - L * (0.5 + wig)); ctx.lineTo(x2 - L * 1.5, y2 + L * (0.5 - wig)); ctx.fill();
        ctx.globalAlpha = 1;
      });
    }
    for (i = N - 2; i >= 0; i--) {
      var A = rings[i + 1], B = rings[i], fog = Math.min(1, A.z / maxZ);
      fog = aqua ? fog : fog * fog;
      for (var j = 0; j < M; j++) {
        var a0 = j / M * TAU, a1 = (j + 1) / M * TAU, am = (a0 + a1) / 2;
        var floor = Math.abs(am - Math.PI / 2) < (aqua ? 0.75 : 0.65);
        var col;
        if (aqua) {
          if (!floor) continue;
          col = (B.k % 6 === 0) ? [70, 92, 110] : [30, 46, 60];
        } else if (floor) {
          col = ((B.k * 3 + j * 7) % 11 === 0) ? [235, 250, 255] : [120, 205, 238];
        } else {
          var lit = 1 - Math.sin(am) * 0.18;
          col = (B.k % 4 < 2) ? [20 * lit, 120 * lit, 184 * lit] : [242 * lit, 177 * lit, 52 * lit];
          col = [Math.min(255, col[0]), Math.min(255, col[1]), Math.min(255, col[2])];
        }
        var cs = mix(col, fogC, fog);
        ctx.fillStyle = cs; ctx.strokeStyle = cs; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(A.x + Math.cos(a0) * A.sc, A.y + Math.sin(a0) * A.sc);
        ctx.lineTo(A.x + Math.cos(a1) * A.sc, A.y + Math.sin(a1) * A.sc);
        ctx.lineTo(B.x + Math.cos(a1) * B.sc, B.y + Math.sin(a1) * B.sc);
        ctx.lineTo(B.x + Math.cos(a0) * B.sc, B.y + Math.sin(a0) * B.sc);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      if (aqua && B.k % 4 === 0) {
        ctx.strokeStyle = 'rgba(8,24,36,' + (0.9 * (1 - fog)) + ')';
        ctx.lineWidth = Math.max(1, 0.07 * B.sc);
        ctx.beginPath(); ctx.arc(B.x, B.y, B.sc, Math.PI / 2 + 0.75, Math.PI / 2 - 0.75 + TAU); ctx.stroke();
      }
    }
    if (!aqua) {
      ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.5, S.speed * 0.05) + ')';
      for (var sp = 0; sp < 14; sp++) {
        var ang = Math.PI / 2 + (Math.random() - 0.5) * 1.3, rr = h * (0.35 + Math.random() * 0.4);
        ctx.beginPath(); ctx.arc(Math.cos(ang) * rr, Math.sin(ang) * rr * 0.9 + h * 0.1, 1.5 + Math.random() * 3, 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawCoaster(ctx, w, h) {
    var f = h * 0.9, t = S.t;
    var slope = (cH(t + 0.05) - cH(t)) / 0.05, dxs = (cX(t + 0.05) - cX(t)) / 0.05;
    var ddx = cX(t + 1) - 2 * cX(t) + cX(t - 1);
    var cam = cH(t) + 1.1, hy = slope * f;
    var roll = Math.max(-0.35, Math.min(0.35, -ddx * 2.2));
    var sky = [255, 227, 196];
    ctx.save();
    ctx.translate(w / 2 - S.look.x * w * 0.3, h / 2 - S.look.y * h * 0.25);
    ctx.rotate(roll);
    var g = ctx.createLinearGradient(0, hy - h * 1.2, 0, hy);
    g.addColorStop(0, '#4FA8E0'); g.addColorStop(1, '#FFE3C4');
    ctx.fillStyle = g; ctx.fillRect(-w * 1.5, hy - h * 2, w * 3, h * 2 + 1);
    var pan = -Math.atan(dxs) * f * 0.8;
    ctx.fillStyle = '#8FB89A';
    ctx.beginPath(); ctx.moveTo(-w * 1.5, hy);
    for (var xh = -w * 1.5; xh <= w * 1.5; xh += 30) ctx.lineTo(xh, hy - 18 - Math.abs(Math.sin((xh + pan) * 0.004)) * 46 - Math.sin((xh + pan) * 0.013) * 8);
    ctx.lineTo(w * 1.5, hy); ctx.fill();
    ctx.strokeStyle = 'rgba(16,35,63,.35)'; ctx.lineWidth = 3;
    var fw = (pan % (w * 2)) - w * 0.6;
    ctx.beginPath(); ctx.arc(fw, hy - 62, 42, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fw - 26, hy); ctx.lineTo(fw, hy - 62); ctx.lineTo(fw + 26, hy); ctx.stroke();
    ctx.fillStyle = '#3E8E55'; ctx.fillRect(-w * 1.5, hy, w * 3, h * 2);
    var b0 = Math.floor(t / 4) + 1;
    for (var bi = 22; bi >= 0; bi--) {
      var zA = (b0 + bi + 1) * 4 - t, zB = Math.max(0.3, (b0 + bi) * 4 - t);
      var yA = hy + cam * f / zA, yB = hy + cam * f / zB;
      ctx.fillStyle = mix((b0 + bi) % 2 ? [62, 142, 85] : [52, 122, 72], sky, Math.min(1, zA / 90) * 0.7);
      ctx.fillRect(-w * 1.5, yA, w * 3, yB - yA + 1);
    }
    var d = 0.5, k0 = Math.floor(t / d) + 1, P = [];
    for (var i = 0; i < 130; i++) {
      var s = (k0 + i) * d, z = s - t; if (z < 0.35) continue;
      var sc = f / z;
      P.push({ i: k0 + i, z: z, sc: sc, x: (cX(s) - cX(t) - dxs * z) * sc, y: (cam - cH(s)) * sc + hy, gy: cam * sc + hy });
    }
    for (i = P.length - 1; i >= 0; i--) {
      var p = P[i], fog = Math.min(1, p.z / 65);
      if (p.i % 6 === 0) {
        ctx.strokeStyle = mix([210, 214, 220], sky, fog); ctx.lineWidth = Math.max(1, 0.09 * p.sc);
        ctx.beginPath(); ctx.moveTo(p.x - 0.5 * p.sc, p.y + 0.1 * p.sc); ctx.lineTo(p.x - 0.7 * p.sc, p.gy);
        ctx.moveTo(p.x + 0.5 * p.sc, p.y + 0.1 * p.sc); ctx.lineTo(p.x + 0.7 * p.sc, p.gy); ctx.stroke();
      }
      ctx.strokeStyle = mix([44, 52, 70], sky, fog); ctx.lineWidth = Math.max(1, 0.07 * p.sc);
      ctx.beginPath(); ctx.moveTo(p.x - 0.6 * p.sc, p.y + 0.04 * p.sc); ctx.lineTo(p.x + 0.6 * p.sc, p.y + 0.04 * p.sc); ctx.stroke();
      if (i > 0) {
        var q = P[i - 1];
        ctx.strokeStyle = mix([214, 69, 32], sky, fog); ctx.lineWidth = Math.max(1.5, 0.11 * q.sc);
        ctx.beginPath();
        ctx.moveTo(p.x - 0.6 * p.sc, p.y); ctx.lineTo(q.x - 0.6 * q.sc, q.y);
        ctx.moveTo(p.x + 0.6 * p.sc, p.y); ctx.lineTo(q.x + 0.6 * q.sc, q.y);
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.fillStyle = '#10233F';
    ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(0, h * 0.9); ctx.quadraticCurveTo(w / 2, h * 0.8, w, h * 0.9); ctx.lineTo(w, h); ctx.fill();
    ctx.strokeStyle = '#F2B134'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(w * 0.08, h * 0.885); ctx.quadraticCurveTo(w / 2, h * 0.79, w * 0.92, h * 0.885); ctx.stroke();
  }

  resetFish();
  renderUI();
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    try { step(dt); } catch (err) { /* sigue el bucle */ }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
