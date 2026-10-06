// Particle hero (variant A: plays once, no dependency).
// The same points morph through three shapes that tell the career story:
// a folding-bike engineering drawing, clustered data, then a neural network.
// Every frame is computed from elapsed time, so pause, resize and the
// reduced-motion final frame all come from one function.
(() => {
  const frame = document.querySelector("[data-hero]");
  const canvas = frame && frame.querySelector("canvas");
  const ctx = canvas && canvas.getContext("2d");
  if (!ctx) return;

  const stageList = document.querySelector("[data-stages]");
  const stageItems = stageList ? [...stageList.querySelectorAll("li")] : [];
  const toggle = document.querySelector("[data-hero-toggle]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const css = getComputedStyle(document.documentElement);
  const token = (name) => css.getPropertyValue(name).trim();
  const ICE = 0, DIM = 1, AMBER = 2;
  // Tokens are read lazily and only kept once they all resolve. An empty
  // value makes canvas ignore fillStyle, which paints black dots.
  let COLOURS = [], GRID = "", coloursReady = false;
  function loadColours() {
    const c = [token("--ice"), token("--slate"), token("--amber"), token("--frost")];
    const g = token("--gunmetal");
    if (c.every(Boolean) && g) { COLOURS = c; GRID = g; coloursReady = true; }
    return coloursReady;
  }
  loadColours();

  // Design space; the canvas scales it to fit.
  const W = 500, H = 400;
  const N = Math.min(window.innerWidth, window.innerHeight * 1.5) < 640 ? 1200 : 2400;

  // Timeline in milliseconds
  const T = {
    assemble: [0, 1200],
    toData: [2400, 3600],
    amberCluster: 3900,
    toNetwork: [4400, 5600],
    pulse: [5700, 6600],
    end: 6800,
  };
  const STAGE_STARTS = [0, T.toData[0], T.toNetwork[0]];

  // Seeded random so the shapes look the same on every visit
  let seed = 20250829;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => {
    const u = 1 - rand(), v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  // Roles decide colour. Network roles are coloured by the pulse.
  const R_MAIN = 0, R_DIM = 1, R_HIGHLIGHT = 2, R_EDGE = 3, R_NODE = 4, R_OUTPUT = 5;

  // ---------- Primitives ----------
  const line = (x1, y1, x2, y2, role = R_MAIN, w = 1) => ({
    at: (t) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t],
    len: Math.hypot(x2 - x1, y2 - y1), role, w,
  });
  const arc = (cx, cy, r, role = R_MAIN, w = 1, a0 = 0, a1 = Math.PI * 2) => ({
    at: (t) => {
      const a = a0 + (a1 - a0) * t;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    },
    len: r * Math.abs(a1 - a0), role, w,
  });
  const curve = (x1, y1, cx, cy, x2, y2, role = R_MAIN, w = 1) => {
    const at = (t) => {
      const m = 1 - t;
      return [m * m * x1 + 2 * m * t * cx + t * t * x2, m * m * y1 + 2 * m * t * cy + t * t * y2];
    };
    let len = 0, prev = at(0);
    for (let i = 1; i <= 20; i++) {
      const p = at(i / 20);
      len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
      prev = p;
    }
    return { at, len, role, w };
  };
  const blob = (cx, cy, sx, sy, weight, role = R_MAIN) => ({
    at: () => [cx + gauss() * sx, cy + gauss() * sy],
    len: weight, role, w: 1, scatter: true,
  });

  // Spread n points over primitives in proportion to length x weight
  function sample(prims, n) {
    const total = prims.reduce((s, p) => s + p.len * p.w, 0);
    const xs = new Float32Array(n), ys = new Float32Array(n), roles = new Uint8Array(n);
    let k = 0;
    prims.forEach((p, i) => {
      const count = i === prims.length - 1 ? n - k : Math.round((n * p.len * p.w) / total);
      for (let j = 0; j < count && k < n; j++, k++) {
        const t = p.scatter ? 0 : (j + 0.25 + rand() * 0.5) / count;
        const [x, y] = p.at(t);
        xs[k] = x + (p.scatter ? 0 : (rand() - 0.5) * 1.2);
        ys[k] = y + (p.scatter ? 0 : (rand() - 0.5) * 1.2);
        roles[k] = p.role;
      }
    });
    // Sort left to right so each point travels a short way between shapes
    const order = [...Array(n).keys()].sort((a, b) => xs[a] + ys[a] * 0.08 - (xs[b] + ys[b] * 0.08));
    const out = { x: new Float32Array(n), y: new Float32Array(n), role: new Uint8Array(n) };
    order.forEach((src, dst) => {
      out.x[dst] = xs[src];
      out.y[dst] = ys[src];
      out.role[dst] = roles[src];
    });
    return out;
  }

  // ---------- Shape 1: folding bike, side elevation, with dimension lines ----------
  function bikeShape() {
    const rear = [138, 282], front = [372, 282], r = 62, bb = [236, 292];
    const p = [
      arc(rear[0], rear[1], r, R_MAIN, 1.3), arc(rear[0], rear[1], r - 11, R_MAIN, 0.7),
      arc(front[0], front[1], r, R_MAIN, 1.3), arc(front[0], front[1], r - 11, R_MAIN, 0.7),
      arc(rear[0], rear[1], 5), arc(front[0], front[1], 5),
      arc(bb[0], bb[1], 20, R_MAIN, 1.1),
      curve(338, 180, 300, 248, 228, 262, R_MAIN, 1.5),   // curved main frame
      line(228, 262, bb[0], bb[1]),                        // to bottom bracket
      line(bb[0], bb[1], rear[0], rear[1]),                 // chain stay
      line(226, 254, rear[0], rear[1]),                     // seat stay
      line(232, 266, 214, 118, R_MAIN, 1.2),                // seat post
      curve(184, 114, 212, 104, 244, 113, R_MAIN, 1.2),     // saddle
      line(184, 114, 244, 113),
      line(338, 180, 346, 196, R_MAIN, 1.4),                // head tube
      line(338, 180, 352, 104, R_MAIN, 1.2),                // stem
      line(336, 98, 374, 104, R_MAIN, 1.2),                 // handlebar
      curve(346, 196, 358, 246, front[0], front[1], R_MAIN, 1.2), // fork
      line(bb[0], bb[1] - 20, rear[0], rear[1] - 6, R_DIM, 0.6), // chain
      line(bb[0], bb[1] + 20, rear[0], rear[1] + 6, R_DIM, 0.6),
      line(256, 300, 270, 300, R_MAIN, 0.8),                // pedal
      // Dimension lines (no values: this is a drawing convention, not a spec)
      line(rear[0], 366, front[0], 366, R_DIM, 0.7),
      line(rear[0], 356, rear[0], 376, R_DIM, 0.7),
      line(front[0], 356, front[0], 376, R_DIM, 0.7),
      line(rear[0], 366, rear[0] + 10, 362, R_DIM, 0.5), line(rear[0], 366, rear[0] + 10, 370, R_DIM, 0.5),
      line(front[0], 366, front[0] - 10, 362, R_DIM, 0.5), line(front[0], 366, front[0] - 10, 370, R_DIM, 0.5),
      line(52, 98, 52, 344, R_DIM, 0.7),
      line(42, 98, 62, 98, R_DIM, 0.7),
      line(42, 344, 62, 344, R_DIM, 0.7),
      line(rear[0], rear[1], rear[0], 356, R_DIM, 0.35),
      line(front[0], front[1], front[0], 356, R_DIM, 0.35),
    ];
    return sample(p, N);
  }

  // ---------- Shape 2: clustered scatter plot, one cluster highlighted ----------
  function dataShape() {
    const p = [
      line(56, 352, 456, 352, R_DIM, 0.8), line(56, 352, 56, 60, R_DIM, 0.8),
      blob(132, 268, 26, 20, 230), blob(214, 150, 22, 26, 210),
      blob(318, 252, 30, 22, 250), blob(392, 136, 20, 18, 170, R_HIGHLIGHT),
      blob(268, 330 - 120, 12, 12, 70),
    ];
    for (let x = 96; x <= 456; x += 40) p.push(line(x, 352, x, 358, R_DIM, 0.6));
    for (let y = 312; y >= 72; y -= 40) p.push(line(50, y, 56, y, R_DIM, 0.6));
    return sample(p, N);
  }

  // ---------- Shape 3: layered network, output lights amber ----------
  const LAYERS_X = [86, 196, 306, 416];
  function networkShape() {
    const counts = [4, 6, 6, 3];
    const nodes = counts.map((c, li) =>
      Array.from({ length: c }, (_, i) => [LAYERS_X[li], 200 + (i - (c - 1) / 2) * 44])
    );
    const p = [];
    for (let li = 0; li < nodes.length - 1; li++) {
      for (const a of nodes[li]) for (const b of nodes[li + 1]) p.push(line(a[0] + 10, a[1], b[0] - 10, b[1], R_EDGE, 0.6));
    }
    nodes.forEach((layer, li) =>
      layer.forEach((n, i) => {
        const role = li === nodes.length - 1 && i === 1 ? R_OUTPUT : R_NODE;
        p.push(arc(n[0], n[1], 10, role, 2.2), arc(n[0], n[1], 4, role, 2.2));
      })
    );
    return sample(p, N);
  }

  function noiseShape() {
    const out = { x: new Float32Array(N), y: new Float32Array(N), role: new Uint8Array(N).fill(R_DIM) };
    for (let i = 0; i < N; i++) {
      out.x[i] = rand() * W;
      out.y[i] = rand() * H;
    }
    return out;
  }

  const shapes = [noiseShape(), bikeShape(), dataShape(), networkShape()];
  const delays = new Float32Array(N);
  for (let i = 0; i < N; i++) delays[i] = (i / N) * 320 + rand() * 90;
  const MAX_DELAY = 410;

  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  // ---------- Cursor response (mouse only) ----------
  const ox = new Float32Array(N), oy = new Float32Array(N);
  let pointer = null, springsActive = false;

  // ---------- Sizing ----------
  let scale = 1, offX = 0, offY = 0, dpr = 1, dot = 2;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    scale = Math.min(canvas.width / W, canvas.height / H);
    offX = (canvas.width - W * scale) / 2;
    offY = (canvas.height - H * scale) / 2;
    dot = Math.max(1.4 * dpr, 1.55 * scale);
  }

  // ---------- Draw one moment of the timeline ----------
  const buckets = [[], [], [], []];
  function draw(t) {
    if (!coloursReady && !loadColours()) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Drawing grid behind the bike, fading out as stage 1 ends
    const gridAlpha = t < 600 ? t / 600 : t < 2000 ? 1 : clamp01(1 - (t - 2000) / 400);
    if (gridAlpha > 0) {
      ctx.globalAlpha = gridAlpha * 0.7;
      ctx.strokeStyle = GRID;
      ctx.lineWidth = Math.max(1, dpr * 0.75);
      ctx.beginPath();
      for (let x = 25; x < W; x += 25) {
        ctx.moveTo(offX + x * scale, offY);
        ctx.lineTo(offX + x * scale, offY + H * scale);
      }
      for (let y = 25; y < H; y += 25) {
        ctx.moveTo(offX, offY + y * scale);
        ctx.lineTo(offX + W * scale, offY + y * scale);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Which transition are we in?
    let from = 0, to = 1, start = T.assemble[0], dur = T.assemble[1] - T.assemble[0];
    if (t >= T.toNetwork[0]) { from = 2; to = 3; start = T.toNetwork[0]; dur = T.toNetwork[1] - start; }
    else if (t >= T.toData[0]) { from = 1; to = 2; start = T.toData[0]; dur = T.toData[1] - start; }
    const A = shapes[from], B = shapes[to];
    const travel = dur - MAX_DELAY;
    const pulseX = t >= T.pulse[0] && t <= T.pulse[1]
      ? LAYERS_X[0] + ((t - T.pulse[0]) / (T.pulse[1] - T.pulse[0])) * (LAYERS_X[3] - LAYERS_X[0])
      : -1000;
    const outputLit = t >= T.pulse[1];

    for (const b of buckets) b.length = 0;
    for (let i = 0; i < N; i++) {
      const p = easeInOut(clamp01((t - start - delays[i]) / travel));
      const x = A.x[i] + (B.x[i] - A.x[i]) * p + ox[i];
      const y = A.y[i] + (B.y[i] - A.y[i]) * p + oy[i];
      const shapeIdx = p > 0.5 ? to : from;
      const role = shapes[shapeIdx].role[i];
      let c = ICE;
      if (role === R_DIM) c = DIM;
      else if (role === R_HIGHLIGHT) c = t >= T.amberCluster ? AMBER : ICE;
      else if (role === R_EDGE) c = Math.abs(x - pulseX) < 26 ? ICE : DIM;
      else if (role === R_OUTPUT) c = outputLit ? AMBER : DIM;
      buckets[c].push(offX + x * scale, offY + y * scale);
    }
    const half = dot / 2;
    buckets.forEach((pts, c) => {
      if (!pts.length) return;
      ctx.fillStyle = COLOURS[c];
      for (let k = 0; k < pts.length; k += 2) ctx.fillRect(pts[k] - half, pts[k + 1] - half, dot, dot);
    });
    // Hide the no-JS poster only once a frame has drawn successfully
    frame.classList.add("is-live");
  }

  // ---------- Stage captions ----------
  let shownStage = -1;
  function syncStages(t) {
    const done = t >= T.end;
    let stage = 0;
    STAGE_STARTS.forEach((s, i) => { if (t >= s) stage = i; });
    const key = done ? 3 : stage;
    if (key === shownStage) return;
    shownStage = key;
    stageItems.forEach((li, i) => {
      li.classList.toggle("is-active", !done && i === stage);
      li.classList.toggle("is-done", i < stage || (done && i < 2));
      li.classList.toggle("is-final", done && i === 2);
    });
    if (stageList) stageList.classList.toggle("is-playing", !done);
  }

  // ---------- Play state ----------
  let elapsed = 0, last = 0, playing = false, visible = true, raf = 0;
  let inView = true, tabVisible = !document.hidden;
  const updateVisible = () => {
    visible = inView && tabVisible;
    if (visible) kick();
  };

  const ICONS = {
    pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 3h3v10H4zM9 3h3v10H9z"/></svg>',
    play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 2.5v11l9-5.5z"/></svg>',
    replay: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.6h2.6"/></svg>',
  };
  function setToggle(state) {
    if (!toggle) return;
    const label = { pause: "Pause animation", play: "Play animation", replay: "Replay animation" }[state];
    toggle.innerHTML = ICONS[state] + "<span>" + label + "</span>";
    toggle.dataset.state = state;
  }

  function loop(now) {
    raf = 0;
    const dt = last ? Math.min(now - last, 64) : 0;
    last = now;
    if (playing && visible) elapsed = Math.min(elapsed + dt, T.end);
    if (springsActive) stepSprings();
    draw(elapsed);
    syncStages(elapsed);
    if (elapsed >= T.end && playing) {
      playing = false;
      setToggle("replay");
    }
    if ((playing && visible) || springsActive) raf = requestAnimationFrame(loop);
    else last = 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  function stepSprings() {
    const radius = 80, push = 26;
    let moving = false;
    let px = 0, py = 0;
    if (pointer) {
      px = (pointer.x * dpr - offX) / scale;
      py = (pointer.y * dpr - offY) / scale;
    }
    const A = shapes[3];
    for (let i = 0; i < N; i++) {
      let tx = 0, ty = 0;
      if (pointer) {
        const dx = A.x[i] - px, dy = A.y[i] - py;
        const d = Math.hypot(dx, dy);
        if (d < radius && d > 0.01) {
          const f = (1 - d / radius) * push;
          tx = (dx / d) * f;
          ty = (dy / d) * f;
        }
      }
      ox[i] += (tx - ox[i]) * 0.14;
      oy[i] += (ty - oy[i]) * 0.14;
      if (Math.abs(ox[i]) > 0.05 || Math.abs(oy[i]) > 0.05 || tx || ty) moving = true;
    }
    springsActive = moving || !!pointer;
  }

  // ---------- Wire up ----------
  resize();
  draw(0);
  // If the tokens were not ready yet, draw the current moment once they are
  window.addEventListener("load", () => { if (!frame.classList.contains("is-live")) draw(elapsed); });

  // ?hero-t=<ms> freezes one moment of the timeline: used to check each
  // stage in headless screenshots and to export the no-JS poster.
  const frozen = Number(new URLSearchParams(location.search).get("hero-t"));
  if (frozen) {
    elapsed = Math.min(frozen, T.end);
    draw(elapsed);
    syncStages(elapsed);
    if (toggle) toggle.hidden = true;
  } else if (reduce) {
    // No movement: show the finished network and all three captions.
    elapsed = T.end;
    draw(elapsed);
    syncStages(elapsed);
    if (toggle) toggle.hidden = true;
  } else {
    playing = true;
    setToggle("pause");
    kick();

    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", () => {
        const state = toggle.dataset.state;
        if (state === "replay") {
          elapsed = 0;
          shownStage = -1;
          playing = true;
          setToggle("pause");
        } else if (state === "pause") {
          playing = false;
          setToggle("play");
        } else {
          playing = true;
          setToggle("pause");
        }
        kick();
      });
    }

    // Pause rendering offscreen or in a hidden tab
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        inView = entries[entries.length - 1].isIntersecting;
        updateVisible();
      }).observe(frame);
    }
    document.addEventListener("visibilitychange", () => {
      tabVisible = !document.hidden;
      updateVisible();
    });

    // Points ease away from the cursor once the network has formed
    if (finePointer) {
      canvas.addEventListener("pointermove", (e) => {
        if (elapsed < T.end) return;
        const rect = canvas.getBoundingClientRect();
        pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        springsActive = true;
        kick();
      });
      canvas.addEventListener("pointerleave", () => {
        pointer = null;
        kick();
      });
    }
  }

  // Re-size whenever the box no longer matches the bitmap. The first report is
  // not skipped: on a first visit the layout can still shift (fonts, scrollbar)
  // between the initial resize() and it, which left the hero stretched.
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const d = Math.min(window.devicePixelRatio || 1, 2);
      if (Math.round(rect.width * d) === canvas.width && Math.round(rect.height * d) === canvas.height) return;
      resize();
      draw(elapsed);
    }).observe(canvas);
  }

  // ---------- Name decode (decorative layer over the real text) ----------
  const name = document.querySelector("[data-decode]");
  if (name && !reduce) {
    const lines = [...name.children];
    const layer = document.createElement("span");
    layer.className = "decode-layer";
    layer.setAttribute("aria-hidden", "true");
    const targets = lines.map((l) => {
      const s = document.createElement("span");
      s.style.display = "block";
      layer.appendChild(s);
      return { el: s, text: l.textContent };
    });
    lines.forEach((l) => (l.style.opacity = "0"));
    name.appendChild(layer);
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const t0 = performance.now(), DUR = 600;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      layer.remove();
      lines.forEach((l) => (l.style.opacity = ""));
    };
    // Never leave the name scrambled if animation frames are throttled
    setTimeout(finish, DUR + 400);
    const tick = (now) => {
      if (finished) return;
      const p = Math.min((now - t0) / DUR, 1);
      for (const tg of targets) {
        const fixed = Math.floor(p * tg.text.length);
        let out = tg.text.slice(0, fixed);
        for (let i = fixed; i < tg.text.length; i++) {
          const g = glyphs[(Math.random() * 26) | 0];
          out += i === 0 ? g : g.toLowerCase();
        }
        tg.el.textContent = out;
      }
      if (p < 1) requestAnimationFrame(tick);
      else finish();
    };
    requestAnimationFrame(tick);
  }
})();
