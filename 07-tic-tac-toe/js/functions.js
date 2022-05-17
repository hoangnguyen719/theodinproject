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
  // function returnScore() {
  //   return score;
  // }
  function returnName() {
    return name;
  }
  // function updateName(newName) {
  //   name = newName;
  // }
  function returnSymbol() {
    return symbol;
  }
  // function updateInfoDOM(DOM) {
  //   playerInfoDOM = DOM;
  // }
  function displayScore() {
    playerInfoDOM.querySelector('div.player-name').innerHTML = `Player ${name}`;
    playerInfoDOM.querySelector('div.player-score').innerHTML = score;
  }

  return {
    updateScore
    , resetScore
    // , returnScore
    , returnName
    // , updateName
    , returnSymbol
    // , updateInfoDOM
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
  function resetBoard() {
    for (let i = 0; i < 3; i++) {
      board[i] = Array(3).fill(undefined);
    }
  }
  function updateGameBoard(row, col, value) {
    board[row][col] = value;
  }
  function checkBoardFull() {
    return !board.some(row => row.includes(undefined));
  }
  function checkThreeInARow(value) {
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
    , checkThreeInARow
  };
})();

let gameController = ((board, boardDOM, player1, player2, resetBtn, restartBtn) => {
  const _imageLookUp = {
    'x': 'images/cross.svg'
    , 'o': 'images/circle.svg'
  }
  const _availCellCls = 'game-cell-available';
  let currentPlayer = player1;

  function _switchTurn() {
    currentPlayer = currentPlayer === player2 ? player1 : player2;
  }
  function _returnCurrentPlayerImg() {
    return _imageLookUp[currentPlayer.returnSymbol()]
  }
  function _cellDOMAvailable(cell) {
    return cell.classList.contains(_availCellCls)
  }
  function _checkCellEmpty(cell) {
    return (!cell.querySelector('img')) && (_cellDOMAvailable(cell));
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
    if (board.checkThreeInARow(player1.returnSymbol())) {
      return player1;
    } else if (board.checkThreeInARow(player2.returnSymbol())) {
      return player2;
    } else if (board.checkBoardFull()) {
      return 'draw';
    } else {
      return false;
    }
  }
  function _announce(message) {
    const announceDiv = document.querySelector('#announcement');
    announceDiv.innerHTML = message;
  }
  function _announceWinner(winner) {
    _announce(winner === 'draw'
        ? "It's a Draw!"
        : `Player ${winner.returnName()} Wins!`
    );
  }
  function _displayScores() {
    player1.displayScore();
    player2.displayScore();
  }
  function _updateScore(winner) {
    if (winner !== 'draw') {
      winner.updateScore();
      _displayScores()
    }
  }
  function _makeCellAvailable(cell) {
    if (!_cellDOMAvailable(cell)) {
      cell.classList.add(_availCellCls)
    }
  }
  function _makeCellUnavailable(cell) {
    if (_cellDOMAvailable(cell)) {
      cell.classList.remove(_availCellCls);
    }
  }
  function _makeAllCellsUnavailable() {
    boardDOM.forEach(_makeCellUnavailable);
  }
  function _announceTurn(player) {
    _announce(`Player ${player.returnName()}'s Turn`);
  }
  function _boardCellDOMClick(cell) {
    if (_checkCellEmpty(cell)) {
      _updateGameBoard(cell.getAttribute('row'), cell.getAttribute('col'));
      _updateCellDOM(cell);
      _makeCellUnavailable(cell);
      let winner = _checkWinner();
      if (winner) {
        _makeAllCellsUnavailable();
        _announceWinner(winner);
        _updateScore(winner);
      } else {
        _switchTurn();
        _announceTurn(currentPlayer);
      }
    }
  }

  function _resetBoardDOM() {
    boardDOM.forEach(cell => {
      cell.innerHTML = '';
      _makeCellAvailable(cell);
    });
  }
  function _restartBtnClick() {
    _resetBoardDOM();
    board.resetBoard();
    currentPlayer = player1;
    _announceTurn(currentPlayer);
  }
  function _resetBtnClick() {
    _restartBtnClick();
    player1.resetScore();
    player2.resetScore();
    _displayScores();
  }

  boardDOM.forEach(cell => {
    cell.addEventListener('click', function() {
      _boardCellDOMClick(cell);
    });
  })
  resetBtn.addEventListener('click', _resetBtnClick);
  restartBtn.addEventListener('click', _restartBtnClick);
  _restartBtnClick();
  return {};
})(
  gameBoard
  , document.querySelectorAll('.game-cell')
  , Player('X', 'x', '#player-1')
  , Player('O', 'o', '#player-2')
  , document.querySelector('#reset-btn')
  , document.querySelector('#restart-btn')
  );