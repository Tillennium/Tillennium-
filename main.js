/* Page behaviour: mobile menu, header state, hero terminal feed, CTA routing. */
(function () {
  'use strict';
  const cfg = window.TILLENIUM_CONFIG;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Header shadow once scrolled */
  const header = document.getElementById('site-header');
  function onScroll() { if (header) header.classList.toggle('shadow-lg', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const menuBtn = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      const open = menu.classList.toggle('hidden') === false;
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { menu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* "Explore Terminal" and "Launch App" buttons -> Streamlit dashboard (falls back to #showcase until the URL is set) */
  function route(selector, url) {
    const live = url && !/YOUR[-_]/i.test(url);
    document.querySelectorAll(selector).forEach(function (a) {
      a.setAttribute('href', live ? url : '#showcase');
      if (live) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener noreferrer'); }
    });
    return live;
  }
  const exploreLive = route('[data-explore]', cfg.terminalUrl);
  const launchLive = route('[data-launch]', cfg.appUrl);
  if (!exploreLive || !launchLive) console.warn('[Tillenium] Set terminalUrl / appUrl in config.js to your Streamlit dashboard URL.');

  /* Hero terminal: illustrative filing feed */
  const feed = document.getElementById('feed');
  if (feed) {
    let n = 0;
    const clock = function () { return new Date().toLocaleTimeString('en-GB'); };
    const row = function (r) {
      const li = document.createElement('li');
      li.className = 'term-row';
      const t = document.createElement('span'); t.className = 't'; t.textContent = clock();
      const f = document.createElement('span'); f.className = 'f'; f.textContent = r[0];
      const m = document.createElement('span'); m.className = 'm'; m.textContent = r[1];
      const s = document.createElement('span'); s.className = 'sig sig-' + r[2]; s.textContent = r[2].toUpperCase();
      li.append(t, f, m, s);
      return li;
    };
    const push = function () {
      feed.prepend(row(cfg.feed[n++ % cfg.feed.length]));
      while (feed.children.length > 6) feed.lastElementChild.remove();
    };
    for (let i = 0; i < 5; i++) push();
    if (!reduce) window.setInterval(push, 2800);
  }
})();
