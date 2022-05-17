function Player(playerName, playerSymbol) {
  let score = 0;
  let name = playerName;
  let symbol = playerSymbol;
  function updateScore() {
    score++;
  }
  function resetScore() {
    score = 0;
  }
  function returnScore() {
    return score;
  }
  function returnName() {
    return name;
  }
  function updateName(newName) {
    name = newName;
  }
  function returnSymbol() {
    return symbol
  }

  return {
    updateScore
    , resetScore
    , returnScore
    , returnName
    , updateName
    , returnSymbol
  };
}

let gameBoard = (() => {
  let rows;
  function resetRows() {
    rows = Array(3).fill(Array(3));
  }
  function returnRows() {
    return rows;
  }
  function updateGameBoard(row, col, value) {
    rows[row][col] = value;
  }
  function checkBoardFull() {
    return !rows.some(row => row.includes(undefined));
  }
  resetRows();
  return {
    updateGameBoard
    , resetRows
    , returnRows
    , checkBoardFull
  };
})();

let gameController = ((board, player1, player2) => {
  function checkWinner() {

  }
  function restartGame() {

  }
  function resetGame() {

  }
  function updateScoreBoard() {

  }
  return {
    checkWinner
    , restartGame
    , resetGame
    , updateScoreBoard
  };
})(gameBoard);