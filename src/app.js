(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const resizeFns = [];
  const I18N = JSON.parse($('#i18n').textContent);

  /* toast */
  const toastEl = $('#toast'); let toastT = 0;
  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2600); }

  /* pickleball renderer: 40 holes on a Fibonacci sphere, foreshortened toward the rim */
  const HOLES = (() => { const n = 40, out = [], ga = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++){ const y = 1 - (i + .5) * 2 / n, r = Math.sqrt(1 - y * y), a = i * ga; out.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return out; })();
  function drawBall(ctx, cx, cy, R, spin, tilt){
    if (R < .6) return;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = '#B8F44F'; ctx.fill(); ctx.clip();
    const cs = Math.cos(spin), ss = Math.sin(spin), ct = Math.cos(tilt), st = Math.sin(tilt), hr = .15 * R;
    ctx.fillStyle = '#7FAA2A';
    for (let i = 0; i < HOLES.length; i++){
      const h = HOLES[i];
      let x = h[0], y = h[1] * cs - h[2] * ss, z = h[1] * ss + h[2] * cs;
      const x2 = x * ct + z * st, z2 = -x * st + z * ct; x = x2; z = z2;
      if (z < .08) continue;
      ctx.beginPath(); ctx.ellipse(cx + x * R, cy - y * R, Math.max(hr * z, .35), hr, Math.atan2(-y, x), 0, Math.PI * 2); ctx.fill();
    }
    const g = ctx.createRadialGradient(cx - R * .38, cy - R * .42, R * .05, cx, cy, R * 1.02);
    g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.32, 'rgba(255,255,255,0)'); g.addColorStop(.72, 'rgba(30,24,110,.08)'); g.addColorStop(1, 'rgba(30,24,110,.42)');
    ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
  }

  /* HERO: perspective court with an endless rally */
  function initHero(){
    const hero = $('#top'), cv = $('#court'); if (!hero || !cv) return;
    const ctx = cv.getContext('2d'), hitsEl = $('#hits'), hud = $('#hud');
    const CW = 10, CL = 22, KIT = 7, NH = 3, BR = 1.15;
    let W = 0, H = 0, P = null, scale = 1, narrow = false;
    function setup(){
      const r = cv.getBoundingClientRect();
      if (Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 1 && P) return false;
      W = r.width; H = r.height; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      narrow = W < 720;
      const yaw = narrow ? -.38 : -.7, C = narrow ? [0, 30, -44] : [0, 29, -42], T = [0, 0, narrow ? 3 : 5];
      const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const nrm = a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
      const f = nrm(sub(T, C)), rt = nrm(cross([0, 1, 0], f)), up = cross(f, rt), cy = Math.cos(yaw), sy = Math.sin(yaw);
      const raw = (x, y, z) => { const X = x * cy + z * sy, Z = -x * sy + z * cy, d = [X - C[0], y - C[1], Z - C[2]], zc = dot(d, f); return [dot(d, rt) / zc, -dot(d, up) / zc, zc]; };
      let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
      [[-CW, 0, -CL], [CW, 0, -CL], [CW, 0, CL], [-CW, 0, CL], [-CW, 12, 0], [CW, 12, 0], [-CW, 9, CL], [CW, 9, CL]].forEach(p => { const q = raw(p[0], p[1], p[2]); a = Math.min(a, q[0]); b = Math.max(b, q[0]); c = Math.min(c, q[1]); d = Math.max(d, q[1]); });
      const box = narrow ? [.03 * W, .56 * H, .97 * W, .985 * H] : [.4 * W, .34 * H, .99 * W, .99 * H];
      scale = Math.min((box[2] - box[0]) / (b - a), (box[3] - box[1]) / (d - c));
      const ox = box[0] + ((box[2] - box[0]) - (b - a) * scale) / 2 - a * scale, oy = box[1] + ((box[3] - box[1]) - (d - c) * scale) / 2 - c * scale;
      P = (x, y, z) => { const q = raw(x, y, z); return [q[0] * scale + ox, q[1] * scale + oy, q[2]]; };
      return true;
    }
    const rnd = (a, b) => a + Math.random() * (b - a);
    let seg = null, hits = 0, spin = 0, spinV = 7, tScale = 1, smashNext = false;
    const rings = [], ripples = [];
    function setHits(){ if (hitsEl) hitsEl.textContent = String(hits).padStart(2, '0'); }
    function hit(from){
      const tgt = from[2] < 0 ? 1 : -1; let bz, h, dur;
      if (smashNext){ smashNext = false; bz = tgt * rnd(10, 18); h = 3; dur = .5; spinV = 26; }
      else {
        const k = Math.random();
        if (k < .32 && Math.abs(from[2]) < 11){ bz = tgt * rnd(2.4, 6); h = 3.9; dur = 1.05; spinV = 5; }
        else if (k < .5){ bz = tgt * rnd(15, 20); h = 11; dur = 1.55; spinV = 4; }
        else { bz = tgt * rnd(9, 19); h = 3.6; dur = .85; spinV = 11; }
      }
      seg = { from: from.slice(), to: [rnd(-8, 8), BR, bz], dur, h, t: 0, bounce: false };
      hits++; setHits();
    }
    function bounce(at){
      rings.push({ x: at[0], z: at[2], t: 0 });
      const s = Math.sign(at[2]), hz = s * clamp(Math.abs(at[2]) + rnd(2.5, 5.5), 8, 21.5);
      seg = { from: at.slice(), to: [clamp(at[0] + rnd(-3, 3), -9, 9), 2.4, hz], dur: rnd(.4, .58), h: 1.9, t: 0, bounce: true };
    }
    function ballPos(){ const s = clamp(seg.t / seg.dur, 0, 1), f = seg.from, to = seg.to; return [f[0] + (to[0] - f[0]) * s, f[1] + (to[1] - f[1]) * s + 4 * seg.h * s * (1 - s), f[2] + (to[2] - f[2]) * s]; }
    function step(dt){
      seg.t += dt * tScale; spin += spinV * dt * tScale;
      if (seg.t >= seg.dur){ const e = seg.to.slice(); tScale = 1; if (!seg.bounce) bounce([e[0], BR, e[2]]); else hit(e); }
      for (const r of rings) r.t += dt; while (rings.length && rings[0].t > .7) rings.shift();
      for (const r of ripples) r.t += dt; while (ripples.length && ripples[0].t > .6) ripples.shift();
    }
    const ease = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
    function poly(pts){ ctx.beginPath(); pts.forEach((p, i) => { const q = P(p[0], p[1], p[2]); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath(); }
    function seg3(a, b, k){ if (k <= 0) return; const e = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k], p = P(a[0], a[1], a[2]), q = P(e[0], e[1], e[2]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
    function circle(x, z, r, n){ const pts = []; for (let i = 0; i < n; i++){ const a = i / n * Math.PI * 2; pts.push([x + Math.cos(a) * r, 0, z + Math.sin(a) * r]); } return pts; }
    const LINES = [
      [[-CW, 0, -CL], [-CW, 0, CL], 0], [[CW, 0, CL], [CW, 0, -CL], 0],
      [[-CW, 0, -CL], [CW, 0, -CL], .12], [[CW, 0, CL], [-CW, 0, CL], .12],
      [[-CW, 0, -KIT], [CW, 0, -KIT], .26], [[CW, 0, KIT], [-CW, 0, KIT], .26],
      [[0, 0, -KIT], [0, 0, -CL], .38], [[0, 0, KIT], [0, 0, CL], .38]
    ];
    function drawCourt(el){
      ctx.globalAlpha = ease(el / .8);
      poly([[-CW, 0, -CL], [CW, 0, -CL], [CW, 0, CL], [-CW, 0, CL]]); ctx.fillStyle = '#4A42E8'; ctx.fill();
      poly([[-CW, 0, -KIT], [CW, 0, -KIT], [CW, 0, KIT], [-CW, 0, KIT]]); ctx.fillStyle = 'rgba(184,244,79,.17)'; ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath(); LINES.forEach(l => seg3(l[0], l[1], ease((el - l[2]) / .7)));
      ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = narrow ? 1.7 : 2.3; ctx.lineCap = 'round'; ctx.stroke();
    }
    function drawNet(el){
      const a = ease((el - .5) / .6); if (a <= 0) return;
      ctx.globalAlpha = a;
      const L = -CW - 1.2, R = CW + 1.2;
      poly([[L, 0, 0], [R, 0, 0], [R, NH, 0], [L, NH, 0]]); ctx.fillStyle = 'rgba(18,14,70,.38)'; ctx.fill();
      ctx.beginPath(); for (let x = Math.ceil(L); x <= R; x += 1) seg3([x, .1, 0], [x, NH, 0], 1); for (let y = .6; y < NH; y += .6) seg3([L, y, 0], [R, y, 0], 1);
      ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); seg3([L, NH, 0], [R, NH, 0], 1); ctx.strokeStyle = '#fff'; ctx.lineWidth = narrow ? 2.4 : 3.2; ctx.stroke();
      ctx.beginPath(); seg3([L, 0, 0], [L, NH + .3, 0], 1); seg3([R, 0, 0], [R, NH + .3, 0], 1); ctx.strokeStyle = '#19191C'; ctx.lineWidth = narrow ? 3 : 4; ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function drawRings(side){
      for (const r of rings){ if (Math.sign(r.z) !== side) continue; const k = r.t / .7; poly(circle(r.x, r.z, .6 + k * 3.4, 24)); ctx.strokeStyle = `rgba(255,255,255,${.75 * (1 - k)})`; ctx.lineWidth = 1.6; ctx.stroke(); }
    }
    function drawBallAt(b){
      const hg = clamp((b[1] - BR) / 12, 0, 1);
      poly(circle(b[0], b[2], BR * (1.05 + hg * .6), 18)); ctx.fillStyle = `rgba(16,12,70,${.4 * (1 - hg * .75)})`; ctx.fill();
      const q = P(b[0], b[1], b[2]); drawBall(ctx, q[0], q[1], BR / q[2] * scale, spin, .55);
    }
    let t0 = 0, last = 0, raf = 0, visible = true;
    function render(el){
      ctx.clearRect(0, 0, W, H);
      drawCourt(el);
      const b = el > .9 && seg ? ballPos() : null, far = b && b[2] > 0;
      drawRings(1); if (b && far) drawBallAt(b);
      drawNet(el);
      drawRings(-1); if (b && !far) drawBallAt(b);
      for (const r of ripples){ const k = r.t / .6; ctx.beginPath(); ctx.arc(r.x, r.y, 8 + k * 46, 0, Math.PI * 2); ctx.strokeStyle = `rgba(184,244,79,${.9 * (1 - k)})`; ctx.lineWidth = 2.5; ctx.stroke(); }
    }
    function frame(now){
      raf = 0;
      if (!t0){ t0 = now; last = now; }
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const el = (now - t0) / 1000;
      if (el > 1.15) step(dt);
      render(el);
      if (visible) raf = requestAnimationFrame(frame);
    }
    setup();
    if (RM){
      seg = { from: [-4, 2.4, -16], to: [5, BR, 12], dur: 1, h: 6, t: .42, bounce: false }; hits = 7; setHits(); render(9);
      resizeFns.push(() => { if (setup()) render(9); });
      return;
    }
    seg = { from: [-4, 2.2, -21], to: [5, BR, 15], dur: 1.35, h: 6.5, t: 0, bounce: false }; hits = 1; setHits();
    raf = requestAnimationFrame(frame);
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf){ last = performance.now(); raf = requestAnimationFrame(frame); } }).observe(hero);
    document.addEventListener('visibilitychange', () => { if (document.hidden) visible = false; else { const r = hero.getBoundingClientRect(); visible = r.bottom > 0 && r.top < innerHeight; if (visible && !raf){ last = performance.now(); raf = requestAnimationFrame(frame); } } });
    hero.addEventListener('pointerdown', e => {
      if (e.target.closest('a,button')) return;
      smashNext = true; tScale = 2.4; spinV = 26;
      const r = cv.getBoundingClientRect(); ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
      if (hud){ hud.classList.remove('flash'); void hud.offsetWidth; hud.classList.add('flash'); }
    });
    resizeFns.push(setup);
  }

  /* SCOREBOARD: digits flicker once like a stadium board, starting and ending on real values */
  function initBoard(){
    if (RM) return;
    $$('[data-flicker]').forEach(box => {
      const els = $$('[data-d]', box);
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return; io.disconnect();
        els.forEach((el, i) => {
          const fin = el.dataset.d; let n = 0; const total = 10 + Math.min(i, 8) * 2;
          const tick = () => { n++; if (n >= total){ el.textContent = fin; return; } el.textContent = [...fin].map(ch => /\d/.test(ch) ? String(Math.floor(Math.random() * 10)) : ch).join(''); setTimeout(tick, 48); };
          setTimeout(tick, Math.min(i, 8) * 70);
        });
      }, { threshold: .25 });
      io.observe(box);
    });
  }

  /* SCHEDULE: filter by location, mark today's slots (Almaty time) */
  function initSchedule(){
    const chips = $$('.chip[data-loc]'), slots = $$('.slot[data-loc]');
    chips.forEach(ch => ch.addEventListener('click', () => {
      const loc = ch.dataset.loc;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === ch)));
      slots.forEach(s => { s.hidden = loc !== 'all' && s.dataset.loc !== loc; });
    }));
    try {
      const wd = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Almaty', weekday: 'short' }).format(new Date());
      const day = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[wd];
      slots.forEach(s => s.classList.toggle('is-today', Number(s.dataset.day) === day));
    } catch (_) {}
  }

  /* CONTACT: copy phone, WhatsApp form, spinning full stop */
  function initContact(){
    const btn = $('#copy'), tel = $('#tel');
    if (btn && tel) btn.addEventListener('click', () => {
      const text = tel.textContent.trim();
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(tel); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast(I18N.copyFail); };
      try { navigator.clipboard.writeText(text).then(() => toast(I18N.copied), fallback); } catch (_) { fallback(); }
    });
    const form = $('#msg');
    if (form) form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form), lines = [I18N.hello];
      const name = String(d.get('name') || '').trim(), text = String(d.get('text') || '').trim();
      if (name) lines.push(`${I18N.lName}: ${name}`);
      lines.push(`${I18N.lTopic}: ${d.get('topic')}`);
      if (text) lines.push(text);
      window.open(`${I18N.wa}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    });
    const dot = $('#dotball'); if (!dot) return;
    const c = dot.getContext('2d'); let S = 0, spin = .6, fast = 0, raf = 0, vis = false, last = 0;
    function size(){ const r = dot.getBoundingClientRect(); S = r.width; dot.width = Math.round(S * DPR); dot.height = Math.round(S * DPR); c.setTransform(DPR, 0, 0, DPR, 0, 0); draw(); }
    function draw(){ c.clearRect(0, 0, S, S); drawBall(c, S / 2, S / 2, S / 2 - 1, spin, .5); }
    function loop(now){ raf = 0; const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; spin += (1.1 + fast) * dt; fast *= .965; draw(); if (vis) raf = requestAnimationFrame(loop); }
    size(); resizeFns.push(size);
    if (!RM){
      new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !raf){ last = 0; raf = requestAnimationFrame(loop); } }).observe(dot);
      const h = dot.closest('h2'); if (h){ h.addEventListener('pointerenter', () => { fast = 12; }); h.addEventListener('pointerdown', () => { fast = 18; }); }
    }
  }

  /* DOCK: mobile booking bar appears after the hero and hides at the contact block */
  function initDock(){
    const dock = $('#dock'), hero = $('#top'), contact = $('#contact'); if (!dock || !hero) return;
    let pastHero = false, atContact = false;
    const upd = () => dock.classList.toggle('on', pastHero && !atContact);
    new IntersectionObserver(es => { pastHero = !es[0].isIntersecting; upd(); }, { threshold: .15 }).observe(hero);
    if (contact) new IntersectionObserver(es => { atContact = es[0].isIntersecting; upd(); }, { threshold: .1 }).observe(contact);
  }

  let rz = 0; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => resizeFns.forEach(f => f()), 140); });
  [initHero, initBoard, initSchedule, initContact, initDock].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => resizeFns.forEach(f => f()));
  addEventListener('load', () => resizeFns.forEach(f => f()));
})();
