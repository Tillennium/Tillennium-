/* Curated report showcase: category tabs, PNGs from this folder with a sample-layout
   fallback, and a keyboard-navigable lightbox. No visitor uploads. */
(function () {
  'use strict';
  const cfg = window.TILLENIUM_CONFIG;
  const grid = document.getElementById('gallery-grid');
  const tabsEl = document.getElementById('gallery-tabs');
  const countEl = document.getElementById('gallery-count');
  const lb = document.getElementById('lightbox');
  if (!grid || !tabsEl || !lb) return;

  const labels = {};
  cfg.galleryCategories.forEach(function (c) { labels[c.id] = c.label; });

  let items = cfg.gallery.map(function (g, i) {
    return Object.assign({ uid: 'g' + i, ok: false, tried: false, local: false }, g);
  });
  let active = 'all';
  let shown = [];
  let lbIndex = 0;

  const esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- Sample layouts (drawn until a real PNG loads) ---------- */
  function textLines(x, y, w, n, gap) {
    let out = '';
    for (let i = 0; i < n; i++) {
      out += '<rect x="' + x + '" y="' + (y + i * gap) + '" width="' + (i % 4 === 3 ? w * 0.6 : w) + '" height="3.5" rx="1.75" class="fill-line"/>';
    }
    return out;
  }

  function wrap(inner) {
    return '<svg viewBox="0 0 400 300" class="h-full w-full" role="img" aria-label="Sample layout" preserveAspectRatio="xMidYMid meet">' +
      '<rect width="400" height="300" class="fill-elevated"/>' + inner + '</svg>';
  }

  function page(x, y, w, h, bars) {
    let b = '';
    for (let i = 0; i < bars.length; i++) {
      const bh = bars[i];
      b += '<rect x="' + (x + 12 + i * 16) + '" y="' + (y + 112 - bh) + '" width="10" height="' + bh + '" rx="1.5" class="' + (i === bars.length - 2 ? 'fill-amber' : 'fill-accent/70') + '"/>';
    }
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" class="fill-surface stroke-line"/>' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="24" rx="4" class="fill-accent"/>' +
      '<rect x="' + (x + 12) + '" y="' + (y + 9) + '" width="64" height="4.5" rx="2" class="fill-bg"/>' +
      textLines(x + 12, y + 36, w - 24, 4, 9) + b +
      textLines(x + 12, y + 130, w - 24, 8, 9) +
      '<rect x="' + (x + 12) + '" y="' + (h + y - 14) + '" width="30" height="3" rx="1.5" class="fill-muted/60"/>';
  }

  const samples = {
    dossier: function (v) {
      const bars = v ? [30, 44, 38, 62, 54, 78, 66, 90] : [22, 34, 48, 40, 58, 70, 84, 60];
      return wrap(
        page(118, 14, 164, 272, bars.slice(0, 8)) +
        '<rect x="22" y="58" width="80" height="62" rx="4" class="fill-surface stroke-line"/>' +
        '<rect x="32" y="70" width="34" height="9" rx="2" class="fill-accent"/>' +
        '<rect x="32" y="88" width="56" height="3.5" rx="1.75" class="fill-line"/><rect x="32" y="98" width="44" height="3.5" rx="1.75" class="fill-line"/>' +
        '<rect x="298" y="170" width="82" height="62" rx="4" class="fill-surface stroke-line"/>' +
        '<circle cx="339" cy="201" r="17" fill="none" stroke-width="7" class="stroke-line"/>' +
        '<circle cx="339" cy="201" r="17" fill="none" stroke-width="7" stroke-dasharray="' + (v ? '62 107' : '78 107') + '" transform="rotate(-90 339 201)" class="stroke-accent"/>'
      );
    },
    pdf: function (v) {
      return wrap(
        '<g transform="rotate(-7 130 160)">' + page(62, 30, 130, 220, [24, 40, 32, 56, 48, 70]) + '</g>' +
        '<g transform="rotate(7 270 160)">' + page(208, 30, 130, 220, [30, 22, 52, 44, 66, 58]) + '</g>' +
        page(135, 22, 130, 236, v ? [20, 36, 52, 44, 68, 82] : [28, 46, 38, 60, 54, 76]) +
        '<rect x="176" y="270" width="48" height="14" rx="7" class="fill-surface stroke-line"/>' +
        '<text x="200" y="280" text-anchor="middle" font-size="8" class="fill-muted font-mono">1 / 14</text>'
      );
    },
    supply: function (v) {
      const hub = v ? [[70, 80], [150, 60], [250, 70], [330, 100], [110, 200], [210, 220], [310, 190]] : [[60, 110], [140, 60], [220, 90], [320, 70], [90, 220], [200, 200], [330, 210]];
      let lines = '', nodes = '';
      const c = [200, 150];
      hub.forEach(function (p, i) {
        lines += '<path d="M' + c[0] + ' ' + c[1] + ' Q' + ((c[0] + p[0]) / 2) + ' ' + (Math.min(c[1], p[1]) - 26) + ' ' + p[0] + ' ' + p[1] + '" fill="none" stroke-width="1.4" ' + (i === 5 ? 'class="stroke-amber"' : 'stroke-dasharray="3 3" class="stroke-accent/60"') + '/>';
        nodes += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 5 ? 8 : 6) + '" class="' + (i === 5 ? 'fill-amber' : 'fill-surface stroke-accent') + '"/>';
      });
      return wrap(
        '<g class="fill-line/70">' + Array.from({ length: 11 }, function (_, r) { return Array.from({ length: 19 }, function (_, q) { return '<circle cx="' + (20 + q * 20) + '" cy="' + (20 + r * 26) + '" r="1"/>'; }).join(''); }).join('') + '</g>' +
        lines + nodes +
        '<circle cx="200" cy="150" r="13" class="fill-accent"/><circle cx="200" cy="150" r="22" fill="none" class="stroke-accent/40"/>' +
        '<text x="' + (hub[5][0] + 14) + '" y="' + (hub[5][1] + 3) + '" font-size="8" class="fill-amber font-mono">DELAY</text>'
      );
    },
    risk: function (v) {
      if (v) {
        return wrap(
          '<rect x="30" y="30" width="340" height="240" rx="6" class="fill-surface stroke-line"/>' +
          '<path d="M60 190 C110 180 140 170 190 160 L190 160 C240 130 300 90 350 60 L350 150 C300 175 240 185 190 160 Z" class="fill-accent/20"/>' +
          '<path d="M60 190 C110 180 140 170 190 160 C240 150 300 120 350 105" fill="none" stroke-width="2.4" class="stroke-accent"/>' +
          '<path d="M190 40 V250" stroke-dasharray="3 4" class="stroke-line"/>' +
          '<text x="196" y="52" font-size="8" class="fill-muted font-mono">FORECAST</text>' +
          textLines(60, 220, 280, 3, 10)
        );
      }
      const bars = [40, 66, 54, 88, 72, 104, 80];
      return wrap(
        '<rect x="30" y="30" width="230" height="240" rx="6" class="fill-surface stroke-line"/>' +
        bars.map(function (h, i) { return '<rect x="' + (48 + i * 29) + '" y="' + (230 - h) + '" width="18" height="' + h + '" rx="2" class="' + (h > 85 ? 'fill-bad/80' : h > 60 ? 'fill-amber/80' : 'fill-accent/70') + '"/>'; }).join('') +
        '<path d="M42 168 H250" stroke-dasharray="4 4" class="stroke-bad/70"/>' +
        '<rect x="278" y="30" width="92" height="116" rx="6" class="fill-surface stroke-line"/>' +
        '<circle cx="324" cy="88" r="28" fill="none" stroke-width="9" class="stroke-line"/>' +
        '<circle cx="324" cy="88" r="28" fill="none" stroke-width="9" stroke-dasharray="118 176" transform="rotate(-90 324 88)" class="stroke-amber"/>' +
        '<rect x="278" y="158" width="92" height="112" rx="6" class="fill-surface stroke-line"/>' +
        textLines(290, 176, 68, 7, 12)
      );
    },
  };

  samples.terminal = samples.supply;
  samples.charts = samples.risk;

  function sample(item) {
    const idx = items.filter(function (i) { return i.category === item.category; }).indexOf(item);
    return (samples[item.category] || samples.dossier)(idx % 2);
  }

  function thumb(item) {
    return item.ok
      ? '<img src="' + esc(item.src) + '" alt="' + esc(item.title) + '" loading="lazy" decoding="async">'
      : sample(item);
  }

  /* ---------- Render ---------- */
  function render() {
    shown = items.filter(function (i) { return active === 'all' || i.category === active; });
    grid.innerHTML = shown.map(function (it, n) {
      return '<li><button type="button" class="g-card panel" data-i="' + n + '" aria-label="Open ' + esc(it.title) + '">' +
        '<div class="g-thumb" data-uid="' + it.uid + '">' + thumb(it) + '</div>' +
        '<div class="p-4"><div class="flex items-center justify-between gap-3">' +
        '<span class="text-xs font-medium text-accent">' + esc(labels[it.category] || it.category) + '</span>' +
        '<span class="font-mono text-[10.5px] text-muted">' + (it.ok ? 'Report' : 'Sample layout') + '</span></div>' +
        '<h3 class="mt-2 text-[15px] font-semibold leading-snug">' + esc(it.title) + '</h3>' +
        '<p class="mt-1 text-sm leading-relaxed text-muted">' + esc(it.caption || '') + '</p></div></button></li>';
    }).join('');
    if (countEl) countEl.textContent = shown.length + (shown.length === 1 ? ' report' : ' reports');
    shown.forEach(probe);
  }

  /* Swap in the real PNG as soon as it exists */
  function probe(item) {
    if (item.ok || item.tried) return;
    item.tried = true;
    const im = new Image();
    im.onload = function () {
      item.ok = true;
      const t = grid.querySelector('[data-uid="' + item.uid + '"]');
      if (t) { render(); }
    };
    im.src = item.src;
  }

  function renderTabs() {
    const all = [{ id: 'all', label: 'All' }].concat(cfg.galleryCategories);
    tabsEl.innerHTML = all.map(function (c) {
      return '<button type="button" role="tab" class="tab" data-cat="' + c.id + '" aria-selected="' + (c.id === active) + '">' + esc(c.label) + '</button>';
    }).join('');
  }

  tabsEl.addEventListener('click', function (e) {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    active = b.getAttribute('data-cat');
    renderTabs();
    render();
  });

  tabsEl.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const tabs = Array.from(tabsEl.querySelectorAll('[role="tab"]'));
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus(); next.click();
    tabsEl.querySelector('[aria-selected="true"]').focus();
  });

  /* ---------- Lightbox ---------- */
  const stage = document.getElementById('lb-stage');
  const cap = document.getElementById('lb-caption');
  const pos = document.getElementById('lb-pos');

  function show(i) {
    if (!shown.length) return;
    lbIndex = (i + shown.length) % shown.length;
    const it = shown[lbIndex];
    stage.innerHTML = it.ok
      ? '<img src="' + esc(it.src) + '" alt="' + esc(it.title) + '">'
      : '<div class="h-full w-full">' + sample(it) + '</div>';
    cap.innerHTML = '<span class="font-semibold">' + esc(it.title) + '</span><span class="text-muted"> · ' + esc(it.caption || '') + '</span>';
    pos.textContent = (lbIndex + 1) + ' / ' + shown.length;
  }

  grid.addEventListener('click', function (e) {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    show(parseInt(b.getAttribute('data-i'), 10));
    if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  });
  document.getElementById('lb-prev').addEventListener('click', function () { show(lbIndex - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { show(lbIndex + 1); });
  document.getElementById('lb-close').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(lbIndex + 1);
    if (e.key === 'ArrowLeft') show(lbIndex - 1);
  });

  renderTabs();
  render();
})();
