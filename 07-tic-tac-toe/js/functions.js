
function Player(playerName, playerSymbol, domID) {
  let score = 0;
  let name = playerName;
  let symbol = playerSymbol;
  let playerInfoDOM = document.querySelector(domID);
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
    return symbol;
  }
  function updateInfoDOM(DOM) {
    playerInfoDOM = DOM;
  }
  function displayScore() {
    playerInfoDOM.querySelector('div.player-score').innerHTML = score;
  }

  return {
    updateScore
    , resetScore
    , returnScore
    , returnName
    , updateName
    , returnSymbol
    , updateInfoDOM
    , displayScore
  };
}

let gameBoard = (() => {
  let board = [];
  function _returnPossibleThrees() {
    return [
      board[0]
      , board[1]
      , board[2]
      , board.map((v, i) => v[0])
      , board.map((v, i) => v[1])
      , board.map((v, i) => v[2])
      , board.map((v, i) => v[i])
      , board.map((v, i) => v[board.length - 1 - i])
    ]
  }
  function _returnBoard() {
    return board;
  }
  function resetBoard() {
    for (let i = 0; i < 3; i++) {
      board[i] = Array(3).fill(undefined);
    }
    // board = [['x', 'x', 'x'],[4,5,6],[7,8,9]];
  }
  function updateGameBoard(row, col, value) {
    board[row][col] = value;
  }
  function checkBoardFull() {
    return !board.some(row => row.includes(undefined));
  }
  function checkThree(value) {
    let possibleThrees = _returnPossibleThrees();
    return possibleThrees.some(three => {
      return three.every(cell => cell === value)
    });
  }
  resetBoard();
  return {
    updateGameBoard
    , resetBoard
    , checkBoardFull
    , checkThree
    // , _returnBoard
    // , _returnPossibleThrees
  };
})();

let gameController = ((board) => {
  const _imageLookUp = {
    'x': 'images/cross.svg'
    , 'o': 'images/circle.svg'
  }
  let player1 = Player('X', 'x', '#player-1');
  let player2 = Player('O', 'o', '#player-2');
  let currentPlayer = player1;

  const boardCells = document.querySelectorAll('.game-cell');

  function _switchTurn() {
    currentPlayer = currentPlayer === player2 ? player1 : player2;
  }
  function _returnCurrentPlayerImg() {
    return _imageLookUp[currentPlayer.returnSymbol()]
  }
  function _checkCellEmpty(cell) {
    return !cell.querySelector('img');
  }
  function _updateGameBoard(row, col) {
    row = typeof row === 'string' ? Number(row) : row;
    col = typeof col === 'string' ? Number(col) : col;
    board.updateGameBoard(row, col, currentPlayer.returnSymbol())
  }
  function _updateCellDOM(cell) {
    let img = document.createElement('img');
    img['src'] = _returnCurrentPlayerImg();
    cell.appendChild(img);
  }
  function _checkWinner() {
    if (board.checkThree(player1.returnSymbol())) {
      return player1;
    } else if (board.checkThree(player2.returnSymbol())) {
      return player2;
    } else if (board.checkBoardFull()) {
      return 'draw';
    } else {
      return false;
    }
  }
  function _announceWinner(winner) {
    const announceDiv = document.querySelector('#announcement');
    announceDiv.innerHTML =
      winner === 'draw'
        ? "It's a Draw!"
        : `Player ${winner.returnName()} Wins!`;
  }
  function _displayScore() {
    player1.displayScore();
    player2.displayScore();
  }
  function _updateScore(winner) {
    if (winner !== 'draw') {
      winner.updateScore();
      _displayScore()
    }
  }
  function _boardCellDOMClick(cell) {
    if (_checkCellEmpty(cell)) {
      _updateGameBoard(cell.getAttribute('row'), cell.getAttribute('col'));
      _updateCellDOM(cell);
      let winner = _checkWinner();
      if (winner) {
        _announceWinner(winner);
        _updateScore(winner);
        // Make all cells unavailable
      } else {
        _switchTurn();
      }
    }
  }

  function _resetBoardDOM() {

  }
  function newGame() {
    _resetBoardDOM();
    board.resetBoard();
  }
  function resetGame() {

  }
  function updateScoreBoard() {

  }

  boardCells.forEach(cell => {
    cell.addEventListener('click', function() {
      _boardCellDOMClick(this);
    });
  })
  return {
    _checkWinner
  };
})(gameBoard);