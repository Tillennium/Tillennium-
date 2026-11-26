/* Hero backdrop: optional image, optional video loop, and an illustrative live signal tape. */
(function () {
  'use strict';
  const cfg = window.TILLENIUM_CONFIG;
  const wrap = document.getElementById('hero-market');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Image: shown only if the file exists */
  const img = document.getElementById('hero-image');
  if (img && cfg.heroImage) {
    const probe = new Image();
    probe.onload = function () { img.src = cfg.heroImage; img.hidden = false; };
    probe.src = cfg.heroImage;
  }

  /* Video: opt-in via config, skipped for reduced motion and data saver */
  const vid = document.getElementById('hero-video');
  const saveData = navigator.connection && navigator.connection.saveData;
  if (vid && cfg.heroVideo && !reduce && !saveData) {
    vid.src = cfg.heroVideo;
    if (cfg.heroVideoPoster) vid.poster = cfg.heroVideoPoster;
    vid.hidden = false;
    vid.play().catch(function () { vid.hidden = true; });
  }

  /* Signal tape: rows drift in alternating directions; values wander slightly */
  if (!wrap || !cfg.backdrop || !cfg.backdrop.length) return;
  const data = cfg.backdrop.map(function (r) { return { s: r[0], v: r[1], p: r[2] }; });
  const fmt = function (d) { return d.v >= 1000 ? d.v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : d.v.toFixed(2); };
  const pct = function (d) { return (d.p >= 0 ? '+' : '') + d.p.toFixed(2) + '%'; };

  const cell = function (d, i) {
    const c = document.createElement('span');
    c.className = 'mkt-cell'; c.dataset.i = i;
    c.innerHTML = '<span class="s"></span><span class="v"></span><span class="c"></span>';
    c.querySelector('.s').textContent = d.s;
    paint(c, d);
    return c;
  };
  function paint(c, d) {
    c.querySelector('.v').textContent = fmt(d);
    const ch = c.querySelector('.c');
    ch.textContent = pct(d);
    ch.className = 'c ' + (d.p >= 0 ? 'up' : 'dn');
  }

  const ROWS = 5;
  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement('div'); row.className = 'mkt-row';
    const track = document.createElement('div'); track.className = 'mkt-track';
    for (let copy = 0; copy < 2; copy++) {
      const half = document.createElement('div'); half.className = 'flex shrink-0';
      for (let k = 0; k < data.length; k++) half.appendChild(cell(data[(k + r * 3) % data.length], (k + r * 3) % data.length));
      track.appendChild(half);
    }
    row.appendChild(track); wrap.appendChild(row);
  }

  if (!reduce) window.setInterval(function () {
    const i = Math.floor(Math.random() * data.length);
    const d = data[i];
    d.v = Math.max(0.01, d.v * (1 + (Math.random() - 0.5) * 0.006));
    d.p = d.p + (Math.random() - 0.5) * 0.12;
    wrap.querySelectorAll('[data-i="' + i + '"]').forEach(function (c) {
      paint(c, d); c.classList.remove('flash'); void c.offsetWidth; c.classList.add('flash');
    });
  }, 1400);
})();
