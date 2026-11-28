/* Fondo ambiental por página.
   Un canvas fijo, sin dependencias, detrás del contenido.
   Cada página recibe un efecto distinto y el color de su tema. */
(function () {
  "use strict";

  var body = document.body;
  if (!body) return;

  var effect = body.getAttribute("data-ambient") || "flow";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  if (!ctx) return;

  canvas.className = "ambient-canvas";
  canvas.setAttribute("aria-hidden", "true");
  body.insertBefore(canvas, body.firstChild);

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0;
  var height = 0;
  var time = 0;
  var last = 0;
  var raf = 0;
  var running = false;
  var colors = readColors();
  var pointer = {
    x: window.innerWidth * 0.62,
    y: window.innerHeight * 0.3,
    tx: window.innerWidth * 0.62,
    ty: window.innerHeight * 0.3,
    active: false
  };
  var blobs = [];
  var bubbles = [];
  var particles = [];
  var cards = [];
  var rings = [];
  var drops = [];
  var lastRipple = 0;

  function readColors() {
    var styles = window.getComputedStyle(body);
    var theme = styles.getPropertyValue("--theme-color").trim();
    var accent = styles.getPropertyValue("--aqua").trim();
    var yellow = styles.getPropertyValue("--bh-yellow").trim();
    var ink = styles.getPropertyValue("--theme-ink").trim();
    return {
      theme: theme || "#0b4f9c",
      accent: accent || "#c62828",
      yellow: yellow || "#e8b400",
      ink: ink || theme || "#0b4f9c",
      dark: document.documentElement.getAttribute("data-theme") === "dark"
    };
  }

  function rgba(color, alpha) {
    var value = (color || "").trim();
    var match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
    if (match) {
      var hex = match[1];
      if (hex.length === 3) {
        hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
      }
      var n = parseInt(hex, 16);
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
    }
    var rgb = /^rgba?\(([^)]+)\)$/i.exec(value);
    if (rgb) {
      var parts = rgb[1].split(",");
      return "rgba(" + parts[0].trim() + "," + parts[1].trim() + "," + parts[2].trim() + "," + alpha + ")";
    }
    return value;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function glow(x, y, radius, color, alpha) {
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, rgba(color, alpha));
    gradient.addColorStop(0.55, rgba(color, alpha * 0.42));
    gradient.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function setup() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var scale = Math.min(width, height);
    blobs = [];
    bubbles = [];
    particles = [];
    cards = [];
    rings = [];
    drops = [];

    if (effect === "flow") {
      for (var i = 0; i < 6; i++) {
        blobs.push({
          x: rand(0.1, 0.9),
          y: rand(0.15, 0.85),
          r: rand(0.22, 0.5) * scale,
          phase: rand(0, Math.PI * 2),
          color: i % 3 === 1 ? colors.accent : colors.theme
        });
      }
    }

    if (effect === "bubbles" || effect === "droplets") {
      var count = width < 700 ? 22 : 38;
      for (var j = 0; j < count; j++) {
        bubbles.push({
          x: rand(0, width),
          y: rand(0, height),
          r: rand(2, 8),
          speed: rand(0.18, 0.55),
          wobble: rand(0, Math.PI * 2),
          depth: rand(0.4, 1)
        });
      }
    }

    if (effect === "streamlines") {
      var countStream = width < 700 ? 40 : 74;
      for (var k = 0; k < countStream; k++) {
        particles.push({
          x: rand(0, width),
          y: rand(0, height),
          px: 0,
          py: 0,
          speed: rand(0.35, 1.1)
        });
      }
    }

    if (effect === "drift") {
      var countCards = width < 700 ? 8 : 14;
      for (var c = 0; c < countCards; c++) {
        cards.push({
          x: rand(0, width),
          y: rand(0, height),
          w: rand(18, 60),
          h: rand(24, 80),
          angle: rand(-0.4, 0.4),
          speed: rand(0.08, 0.25),
          color: c % 4 === 0 ? colors.accent : colors.ink
        });
      }
    }

    if (effect === "droplets") {
      for (var d = 0; d < 22; d++) {
        drops.push({
          x: rand(0, width),
          y: rand(0, height),
          len: rand(5, 16),
          speed: rand(0.3, 0.8)
        });
      }
    }

    if (effect === "ripples") {
      rings.push({ x: width * 0.7, y: height * 0.3, r: 10, max: Math.min(width, height) * 0.6, life: 1, color: colors.theme });
    }
  }

  function pointerGlow() {
    if (!pointer.active || reduce.matches) return;
    glow(pointer.x, pointer.y, Math.min(width, height) * 0.34, colors.theme, colors.dark ? 0.18 : 0.1);
    glow(pointer.x, pointer.y, Math.min(width, height) * 0.14, colors.accent, colors.dark ? 0.14 : 0.07);
  }

  function drawFlow() {
    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i];
      var x = (b.x + Math.sin(time * 0.00007 + b.phase) * 0.13) * width;
      var y = (b.y + Math.cos(time * 0.00005 + b.phase * 1.7) * 0.1) * height;
      glow(x, y, b.r, b.color, colors.dark ? 0.16 : 0.095);
    }
    pointerGlow();
  }

  function drawContours() {
    var cx = width * 0.63 + Math.sin(time * 0.00009) * width * 0.09;
    var cy = height * 0.36 + Math.cos(time * 0.00007) * height * 0.08;
    ctx.lineWidth = 1;
    for (var i = 0; i < 12; i++) {
      var radius = 55 + i * 38;
      ctx.strokeStyle = rgba(i % 3 === 0 ? colors.accent : colors.ink, colors.dark ? 0.16 : 0.095);
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.62, Math.sin(time * 0.0001) * 0.12, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (pointer.active) {
      for (var p = 0; p < 3; p++) {
        ctx.strokeStyle = rgba(colors.yellow, colors.dark ? 0.16 : 0.1);
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 24 + p * 23, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function drawBubbles() {
    for (var i = 0; i < bubbles.length; i++) {
      var b = bubbles[i];
      b.y -= b.speed;
      b.wobble += 0.012;
      if (b.y < -20) {
        b.y = height + 20;
        b.x = rand(0, width);
      }
      var x = b.x + Math.sin(b.wobble) * (6 + b.depth * 9);
      if (pointer.active) {
        var dx = x - pointer.x;
        var dy = b.y - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 150) {
          x += (dx / dist) * (150 - dist) * 0.035;
          b.y += (dy / dist) * (150 - dist) * 0.018;
        }
      }
      ctx.strokeStyle = rgba(i % 5 === 0 ? colors.accent : colors.theme, colors.dark ? 0.25 : 0.16);
      ctx.fillStyle = rgba(colors.theme, colors.dark ? 0.045 : 0.025);
      ctx.beginPath();
      ctx.arc(x, b.y, b.r * b.depth, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    pointerGlow();
  }

  function drawWaves() {
    var rows = 5;
    for (var row = 0; row < rows; row++) {
      var y0 = height * (0.28 + row * 0.12);
      var amp = 10 + row * 3;
      ctx.beginPath();
      for (var x = 0; x <= width; x += 12) {
        var y = y0 + Math.sin(x * 0.008 + time * 0.00055 + row) * amp;
        if (pointer.active) {
          var distance = Math.abs(x - pointer.x);
          y += Math.sin(time * 0.002 + x * 0.02) * Math.max(0, 1 - distance / 240) * 18;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = rgba(row % 3 === 1 ? colors.accent : colors.ink, colors.dark ? 0.22 : 0.15);
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    pointerGlow();
  }

  function drawStreamlines() {
    ctx.save();
    for (var row = 0; row < 8; row++) {
      var baseY = height * (0.14 + row * 0.105);
      ctx.beginPath();
      for (var x = -20; x <= width + 20; x += 28) {
        var y =
          baseY +
          Math.sin(x * 0.004 + time * 0.00022 + row * 1.3) * (16 + row * 3) +
          Math.cos(x * 0.0017 - time * 0.00016 + row) * 8;
        if (x === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = rgba(colors.ink, colors.dark ? 0.16 : 0.11);
      ctx.lineWidth = 1.15;
      ctx.stroke();
    }
    ctx.restore();

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var angle =
        Math.sin(p.x * 0.0022 + time * 0.0002) * 1.4 +
        Math.cos(p.y * 0.003 - time * 0.00015) * 0.9;
      if (pointer.active) {
        var dx = p.x - pointer.x;
        var dy = p.y - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 210) {
          angle += (1 - dist / 210) * 2.2;
        }
      }
      p.px = p.x;
      p.py = p.y;
      p.x += Math.cos(angle) * p.speed;
      p.y += Math.sin(angle) * p.speed;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
      var streak = 28 + p.speed * 24;
      ctx.strokeStyle = rgba(i % 4 === 0 ? colors.accent : colors.ink, colors.dark ? 0.34 : 0.27);
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      ctx.moveTo(p.x - Math.cos(angle) * streak, p.y - Math.sin(angle) * streak);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      if (i % 5 === 0) {
        ctx.fillStyle = rgba(colors.accent, colors.dark ? 0.35 : 0.25);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    pointerGlow();
  }

  function drawDrift() {
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      c.y += c.speed;
      c.x += Math.sin(time * 0.00012 + i) * 0.08;
      if (c.y > height + 100) c.y = -100;
      if (pointer.active) {
        var dx = c.x - pointer.x;
        var dy = c.y - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 190) {
          c.x += (dx / dist) * 0.32;
          c.y += (dy / dist) * 0.32;
        }
      }
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      ctx.strokeStyle = rgba(c.color, colors.dark ? 0.14 : 0.08);
      ctx.fillStyle = rgba(c.color, colors.dark ? 0.025 : 0.015);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    pointerGlow();
  }

  function drawGrid() {
    var spacing = width < 700 ? 30 : 38;
    for (var y = spacing / 2; y < height; y += spacing) {
      for (var x = spacing / 2; x < width; x += spacing) {
        var px = x;
        var py = y;
        var radius = 1.8;
        if (pointer.active) {
          var dx = x - pointer.x;
          var dy = y - pointer.y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 170) {
            var force = (170 - dist) / 170;
            px += (dx / dist) * force * 13;
            py += (dy / dist) * force * 13;
            radius += force * 1.7;
          }
        }
        ctx.fillStyle = rgba(colors.ink, colors.dark ? 0.26 : 0.18);
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    pointerGlow();
  }

  function spawnRipple(x, y, color) {
    var max = Math.min(width, height) * rand(0.22, 0.48);
    rings.push({ x: x, y: y, r: 4, max: max, life: 1, color: color || colors.theme });
  }

  function drawRipples() {
    if (pointer.active && time - lastRipple > 180) {
      spawnRipple(pointer.x, pointer.y, colors.theme);
      lastRipple = time;
    }
    for (var i = rings.length - 1; i >= 0; i--) {
      var ring = rings[i];
      ring.r += 0.9;
      ring.life = 1 - ring.r / ring.max;
      if (ring.life <= 0) {
        rings.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = rgba(ring.color, ring.life * (colors.dark ? 0.28 : 0.16));
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (!pointer.active && rings.length < 2) {
      spawnRipple(width * 0.7, height * 0.28, colors.accent);
    }
    pointerGlow();
  }

  function drawDroplets() {
    for (var i = 0; i < drops.length; i++) {
      var drop = drops[i];
      drop.y += drop.speed;
      if (drop.y > height + 20) {
        drop.y = -20;
        drop.x = rand(0, width);
        spawnRipple(drop.x, height * 0.82, colors.theme);
      }
      ctx.strokeStyle = rgba(i % 5 === 0 ? colors.accent : colors.theme, colors.dark ? 0.2 : 0.12);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.len);
      ctx.stroke();
    }
    drawRipples();
  }

  function drawBase() {
    var radius = Math.min(width, height) * 0.72;
    var x1 = width * (0.22 + Math.sin(time * 0.00006) * 0.08);
    var y1 = height * (0.2 + Math.cos(time * 0.00005) * 0.08);
    var x2 = width * (0.82 + Math.cos(time * 0.000045) * 0.07);
    var y2 = height * (0.78 + Math.sin(time * 0.000055) * 0.07);
    glow(x1, y1, radius, colors.theme, colors.dark ? 0.09 : 0.045);
    glow(x2, y2, radius * 0.82, colors.accent, colors.dark ? 0.07 : 0.032);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;

    if (effect !== "flow") drawBase();
    if (effect === "flow") drawFlow();
    else if (effect === "contours") drawContours();
    else if (effect === "bubbles") drawBubbles();
    else if (effect === "waves") drawWaves();
    else if (effect === "streamlines") drawStreamlines();
    else if (effect === "drift") drawDrift();
    else if (effect === "grid") drawGrid();
    else if (effect === "ripples") drawRipples();
    else if (effect === "droplets") drawDroplets();
    else drawFlow();
  }

  function loop(now) {
    if (!running) return;
    if (document.hidden) {
      running = false;
      return;
    }
    var dt = Math.min(48, now - last || 16);
    last = now;
    time += dt;
    draw();
    raf = window.requestAnimationFrame(loop);
  }

  function start() {
    if (reduce.matches) {
      draw();
      return;
    }
    if (running) return;
    running = true;
    last = window.performance.now();
    raf = window.requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  }

  function onResize() {
    setup();
    if (reduce.matches) draw();
  }

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("pointermove", function (event) {
    pointer.tx = event.clientX;
    pointer.ty = event.clientY;
    pointer.active = true;
    if (effect === "ripples" && !reduce.matches) {
      if (time - lastRipple > 150) {
        spawnRipple(pointer.tx, pointer.ty, colors.theme);
        lastRipple = time;
      }
    }
  }, { passive: true });
  window.addEventListener("pointerdown", function (event) {
    if (reduce.matches) return;
    pointer.tx = event.clientX;
    pointer.ty = event.clientY;
    pointer.active = true;
    spawnRipple(pointer.tx, pointer.ty, colors.accent);
  }, { passive: true });
  document.addEventListener("mouseleave", function () {
    pointer.active = false;
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  if (typeof reduce.addEventListener === "function") {
    reduce.addEventListener("change", function () {
      stop();
      start();
    });
  }

  if (window.MutationObserver) {
    new MutationObserver(function () {
      colors = readColors();
      if (reduce.matches) draw();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  setup();
  start();
})();
