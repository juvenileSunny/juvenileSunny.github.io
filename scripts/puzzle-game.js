/* Optional picture: place your existing image at static/ironman.png.
   Numbered tiles work immediately if the image is unavailable. */
PortfolioGames.register({
  id: 'sliding-puzzle',
  title: 'Sliding Puzzle',
  description: 'A 3 × 3 puzzle. Slide the tiles into order, one move at a time.',
  mount(container) {
    const rules = SlidingPuzzle;
    let board, moves, complete;
    let disposed = false;
    const controller = new AbortController();
    container.innerHTML = `
      <p class="game-instructions" id="puzzle-help">Arrange tiles 1–8 from left to right, top to bottom, leaving the bottom-right space empty. Click or tap a tile beside the gap. Keyboard: Tab to a tile, then Enter or Space.</p>
      <div class="puzzle-toolbar"><span id="puzzle-moves">Moves: 0</span><button type="button" id="puzzle-restart">New puzzle ↻</button></div>
      <div class="puzzle-board" role="group" aria-label="Sliding puzzle board" aria-describedby="puzzle-help"></div>
      <p class="puzzle-status" role="status" aria-live="polite"></p>
      <p class="session-note">Closing ends this session. Reopening starts a new puzzle.</p>`;
    const grid = container.querySelector('.puzzle-board');
    const counter = container.querySelector('#puzzle-moves');
    const status = container.querySelector('.puzzle-status');
    const tiles = Array.from({length: 9}, (_, index) => {
      const tile = document.createElement('button');
      tile.type = 'button'; tile.className = 'puzzle-tile';
      tile.addEventListener('click', () => {
        const movedValue = board[index];
        if (complete || !rules.move(board, index)) return;
        moves++;
        complete = rules.solved(board);
        render();
        // The clicked cell is now empty; keep keyboard focus on the moved tile.
        tiles[board.findIndex(value => value === movedValue)]?.focus();
        status.textContent = complete ? `Puzzle solved in ${moves} moves! Start a new puzzle to play again.` : '';
      }, {signal: controller.signal});
      grid.append(tile); return tile;
    });
    function render() {
      board.forEach((value, i) => {
        const tile = tiles[i];
        tile.dataset.value = String(value);
        tile.textContent = value ? String(value) : '';
        tile.classList.toggle('empty', value === 0);
        tile.disabled = value === 0;
        tile.setAttribute('aria-label', value ? `Tile ${value}, row ${Math.floor(i / 3) + 1}, column ${i % 3 + 1}` : 'Empty space');
        tile.style.backgroundPosition = `${((value - 1) % 3) * 50}% ${Math.floor((value - 1) / 3) * 50}%`;
      });
      counter.textContent = 'Moves: ' + moves;
    }
    function start() {
      board = rules.shuffle(); moves = 0; complete = false;
      status.textContent = ''; render();
    }
    container.querySelector('#puzzle-restart').addEventListener('click', start, {signal: controller.signal});
    const image = new Image();
    image.onload = () => { if (!disposed) grid.classList.add('with-image'); };
    image.onerror = () => { if (!disposed) grid.classList.remove('with-image'); };
    image.src = 'static/ironman.png';
    start();
    return () => {
      disposed = true;
      controller.abort();
      image.onload = image.onerror = null;
      board = [];
      container.replaceChildren();
    };
  }
});
