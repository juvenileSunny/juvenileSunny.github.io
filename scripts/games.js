/* Register one module per game. mount(container) must return a cleanup function.
   No persistence: closing a game destroys its session. */
(() => {
  const registry = new Map();
  const list = document.getElementById('game-list');
  const dialog = document.getElementById('game-dialog');
  const mount = document.getElementById('game-mount');
  const close = document.getElementById('close-game');
  // First three games follow the script order in template.html.
  const PREVIEW_COUNT = 4;
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
      row.className = 'game-row game-tile';
      const info = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = game.title;
      const description = document.createElement('p');
      description.textContent = game.description;
      const play = document.createElement('button');
      play.type = 'button'; play.className = 'game-orb';
      const icons = {
        'sliding-puzzle': '▦', 'target-rush': '◎', 'signal-watch': '✦',
        'precision-path': '∿', 'target-switch': '⇄', 'change-detective': '◈',
        'stop-signal': '⊘', 'rule-switch': '⇆', 'quiet-search': '⌕',
        'rhythm-tracker': '≋', 'depth-explorer': '◉'
      };
      const icon = document.createElement('span');
      icon.className = 'game-orb-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = icons[game.id] || '◇';
      const action = document.createElement('span');
      action.className = 'game-orb-action';
      action.setAttribute('aria-hidden', 'true');
      action.textContent = 'Play ↗';
      play.append(icon, action);
      const details = document.createElement('button');
      details.type = 'button'; details.className = 'game-details-toggle';
      description.id = 'game-description-' + rows.length;
      description.className = 'game-details';
      details.setAttribute('aria-controls', description.id);
      details.setAttribute('aria-label', 'Details for ' + game.title);
      play.setAttribute('aria-describedby', description.id);
      let hovering = false, focusing = false, pinned = false;
      function showDetails() {
        const open = hovering || focusing || pinned;
        description.hidden = !open;
        details.setAttribute('aria-expanded', String(open));
        details.textContent = open ? 'Less −' : 'Details +';
        row.classList.toggle('is-revealed', open);
      }
      row.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: hover)').matches) { hovering = true; showDetails(); }
      });
      row.addEventListener('mouseleave', () => { hovering = false; showDetails(); });
      play.addEventListener('focus', () => { focusing = true; showDetails(); });
      play.addEventListener('blur', () => { focusing = false; showDetails(); });
      details.addEventListener('click', () => {
        const currentlyOpen = hovering || focusing || pinned;
        pinned = !currentlyOpen; hovering = false; focusing = false; showDetails();
      });
      row.addEventListener('keydown', event => {
        if (event.key === 'Escape') { pinned = hovering = focusing = false; showDetails(); }
      });
      showDetails();
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
      info.append(title, details, description); row.append(play, info); list.append(row);
      rows.push(row);
      updateList();
    }
  };
})();
