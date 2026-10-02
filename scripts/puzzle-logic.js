/* Pure puzzle rules, shared by the UI and the Node checks. 0 is the empty tile. */
(function (root) {
  const goal = () => [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const solved = board => board.every((value, i) => value === goal()[i]);
  function neighbors(index) {
    return [index - 3, index + 3, index - 1, index + 1].filter(next =>
      next >= 0 && next < 9 && Math.abs(next % 3 - index % 3) + Math.abs(Math.floor(next / 3) - Math.floor(index / 3)) === 1);
  }
  function move(board, index) {
    const empty = board.indexOf(0);
    if (!neighbors(empty).includes(index)) return false;
    [board[empty], board[index]] = [board[index], board[empty]];
    return true;
  }
  function shuffle(random = Math.random) {
    const board = goal();
    let previous = -1;
    for (let i = 0; i < 160; i++) {
      const empty = board.indexOf(0);
      const choices = neighbors(empty).filter(index => index !== previous);
      move(board, choices[Math.floor(random() * choices.length)]);
      previous = empty;
    }
    if (solved(board)) move(board, neighbors(board.indexOf(0))[0]);
    return board;
  }
  const api = {goal, solved, neighbors, move, shuffle};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SlidingPuzzle = api;
})(globalThis);
