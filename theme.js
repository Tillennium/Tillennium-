/* Dark / light theme toggle. Dark is the default; the choice persists in localStorage. */
(function () {
  'use strict';
  const KEY = 'tillenium-theme';
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  function apply(theme) {
    root.classList.toggle('dark', theme === 'dark');
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#000000' : '#f4f6fa');
    const icon = document.querySelector('link[rel="icon"]');
    if (icon) icon.setAttribute('href', theme === 'dark' ? 'favicon.svg' : 'favicon-light.svg');
    if (btn) {
      const next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      btn.title = 'Switch to ' + next + ' mode';
    }
  }

  function set(theme) {
    root.classList.add('theme-anim');
    apply(theme);
    try { localStorage.setItem(KEY, theme); } catch (e) { /* storage unavailable */ }
    window.setTimeout(function () { root.classList.remove('theme-anim'); }, 350);
    document.dispatchEvent(new CustomEvent('tillenium:theme', { detail: theme }));
  }

  apply(root.classList.contains('dark') ? 'dark' : 'light');
  if (btn) btn.addEventListener('click', function () { set(root.classList.contains('dark') ? 'light' : 'dark'); });
})();
