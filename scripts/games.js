/* Register one module per game. mount(container) must return a cleanup function.
   No persistence: closing a game destroys its session. */
(() => {
  const registry = new Map();
  const list = document.getElementById('game-list');
  const dialog = document.getElementById('game-dialog');
  const mount = document.getElementById('game-mount');
  const close = document.getElementById('close-game');
  // First three games follow the script order in template.html.
  const PREVIEW_COUNT = 3;
  const rows = [];
  let expanded = false;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'games-expand';
  toggle.setAttribute('aria-controls', 'game-list');
  toggle.hidden = true;
  list.after(toggle);
  function updateList() {
    rows.forEach((row, index) => { row.hidden = !expanded && index >= PREVIEW_COUNT; });
    toggle.hidden = rows.length <= PREVIEW_COUNT;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Show fewer games ↑' : `Show all ${rows.length} games ↓`;
  }
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    updateList();
    toggle.focus({ preventScroll: true });
    if (!expanded) toggle.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  });
  let cleanup = null;
  let opener = null;
  let previousOverflow = '';
  function finish() {
    try { if (cleanup) cleanup(); }
    finally {
      cleanup = null;
      mount.replaceChildren();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    }
  }
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', finish);
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  window.PortfolioGames = {
    register(game) {
      if (registry.has(game.id)) throw new Error('Duplicate game: ' + game.id);
      registry.set(game.id, game);
      const row = document.createElement('article');
      row.className = 'game-row';
      const info = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = game.title;
      const description = document.createElement('p');
      description.textContent = game.description;
      const play = document.createElement('button');
      play.type = 'button'; play.className = 'button';
      play.textContent = 'Play ↗';
      play.setAttribute('aria-label', 'Play ' + game.title);
      play.addEventListener('click', () => {
        if (dialog.open) return;
        opener = play;
        document.getElementById('game-title').textContent = game.title;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
        try { cleanup = game.mount(mount); }
        catch (error) {
          mount.textContent = 'This game could not start. Close it and try again.';
          console.error(error);
        }
        close.focus();
      });
      info.append(title, description); row.append(info, play); list.append(row);
      rows.push(row);
      updateList();
    }
  };
})();
