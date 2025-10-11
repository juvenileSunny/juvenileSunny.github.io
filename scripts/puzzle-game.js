// scripts/puzzle-game.js
const playButton = document.querySelector('.btn-primary');
const modal = document.getElementById('puzzleModal');
const closeBtn = document.getElementById('closePuzzle');
const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas?.getContext("2d");
const movesText = document.getElementById("moves");

if (playButton && canvas && ctx) {
  const img = new Image();
  img.src = "static/ironman.png";
  const size = 3;
  const tileSize = canvas.width / size;
  let tiles = [];
  let empty = { x: size - 1, y: size - 1 };
  let moves = 0;

  playButton.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
    initPuzzle();
  });

  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  function initPuzzle() {
    moves = 0;
    movesText.textContent = "Moves: 0";
    tiles = [];

    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) tiles.push({ x, y });

    tiles.pop();
    empty = { x: size - 1, y: size - 1 };
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    drawPuzzle();
  }

  function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let index = 0;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (empty.x === col && empty.y === row) continue;
        const tile = tiles[index];
        ctx.drawImage(img, tile.x * tileSize, tile.y * tileSize, tileSize, tileSize,
          col * tileSize, row * tileSize, tileSize, tileSize);
        index++;
      }
    }
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / tileSize);
    const y = Math.floor((e.clientY - rect.top) / tileSize);
    moveTile(x, y);
  });

  function moveTile(col, row) {
    const dx = col - empty.x, dy = row - empty.y;
    if (Math.abs(dx) + Math.abs(dy) !== 1) return;

    const flat = [];
    let i = 0;
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        flat.push(r === empty.y && c === empty.x ? null : tiles[i++]);

    const temp = flat[row * size + col];
    flat[empty.y * size + empty.x] = temp;
    flat[row * size + col] = null;
    tiles = flat.filter(Boolean);

    empty = { x: col, y: row };
    moves++;
    movesText.textContent = "Moves: " + moves;
    drawPuzzle();

    if (tiles.every((t, i) => t.x === i % size && t.y === Math.floor(i / size)))
      setTimeout(() => alert(`🎉 Puzzle Solved in ${moves} moves!`), 100);
  }

  img.onload = initPuzzle;
}
