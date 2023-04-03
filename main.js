// Global vars
const board = document.querySelector('.squares');
const squares = document.querySelectorAll('.square-item');
const marks = document.querySelectorAll('.mark');
const panel = document.querySelector('.display');
const turn = document.querySelector('.players');
const customize = document.querySelector('.customize');
const replay = document.querySelector('.replay');
const modal = document.querySelector('.modal');
const numInput = document.querySelector('.position');
const textInput = document.querySelector('.name');
const subButton = document.querySelector('.sub');
let endType;
let gameOver = false;

// Create gameboard
const BoardController = (() => {
  const gameboard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const readBoard = () => {
    return gameboard;
  };

  const insertMark = (square, player) => {
    const rowid = parseInt(square.id[2]);
    const colid = parseInt(square.id[3]);
    marker = player.mark;

    if (gameboard[rowid][colid]) {
      console.log('Cannot play there');
    } else {
      gameboard[rowid][colid] = marker;
    }
  };

  const resetGameBoard = () => {
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        gameboard[i][j] = '';
      }
    }
  };

  return { readBoard, insertMark, resetGameBoard };
})();

// Create game controller
const GameController = (() => {
  playerOneName = 'Player One';
  playerTwoName = 'Player Two';

  const players = [
    {
      name: playerOneName,
      mark: 'X',
    },
    {
      name: playerTwoName,
      mark: 'O',
    },
  ];

  let activePlayer = players[0];

  const updateTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => {
    return activePlayer;
  };

  const resetTurns = () => {
    activePlayer = players[0];
  };

  const getPlayerInfo = () => {
    return players;
  };

  const setPlayerName = (number, string) => {
    if (number == 1) {
      players[0].name = string;
    } else if (number == 2) {
      players[1].name = string;
    }
  };

  return {
    getActivePlayer,
    getPlayerInfo,
    updateTurn,
    resetTurns,
    setPlayerName,
  };
})();

// Create display controller
const DisplayController = (() => {
  const updateScreen = () => {
    // Clear existing marks from DOM
    resetDisplay();

    const activePlayer = GameController.getActivePlayer();

    // Update turn label and existing marks
    const turnLabel = document.createElement('p');
    turnLabel.textContent = `${activePlayer.name}, take your turn`;
    turn.appendChild(turnLabel);

    const newBoard = BoardController.readBoard();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        marks.item(3 * i + j).textContent = newBoard[i][j];
      }
    }
  };

  const resetDisplay = () => {
    squares.forEach((square) => (square.firstChild.textContent = ''));
    if (turn.firstChild) {
      turn.firstChild.remove();
    }
  };

  return { updateScreen, resetDisplay };
})();

// Gameover functions

const setGameover = () => {
  gameOver = true;
  if (endType == 'win') {
    turn.firstChild.textContent = `Game Over: ${
      GameController.getActivePlayer().name
    } wins!`;
  } else if ((endType = 'draw')) {
    turn.firstChild.textContent = `Game Over: Draw`;
  }
  replay.classList.add('gameover');
  customize.classList.add('gameover');
};

const checkRows = () => {
  let board = BoardController.readBoard();
  if (
    (board[0][0] && board[0][0] == board[0][1] && board[0][0] == board[0][2]) ||
    (board[1][0] && board[1][0] == board[1][1] && board[1][0] == board[1][2]) ||
    (board[2][0] && board[2][0] == board[2][1] && board[2][0] == board[2][2])
  ) {
    endType = 'win';
    setGameover();
  } else {
    return;
  }
};

const checkColumns = () => {
  let board = BoardController.readBoard();
  if (
    (board[0][0] && board[0][0] == board[1][0] && board[0][0] == board[2][0]) ||
    (board[0][1] && board[0][1] == board[1][1] && board[0][1] == board[2][1]) ||
    (board[0][2] && board[0][2] == board[1][2] && board[0][2] == board[2][2])
  ) {
    endType = 'win';
    setGameover();
  } else {
    return;
  }
};

const checkDiagonals = () => {
  let board = BoardController.readBoard();
  if (
    (board[0][0] && board[0][0] == board[1][1] && board[0][0] == board[2][2]) ||
    (board[0][2] && board[0][2] == board[1][1] && board[0][2] == board[2][0])
  ) {
    endType = 'win';
    setGameover();
  } else {
    return;
  }
};

const checkDraw = () => {
  let board = BoardController.readBoard();
  let fullBoard = true;

  const hasMark = (string) => {
    return string != '';
  };

  for (i = 0; i < 3; i++) {
    fullBoard = fullBoard && board[i].every(hasMark);
  }

  if (fullBoard) {
    endType = 'draw';
    setGameover();
  } else {
    return;
  }
};

const endGameChecks = () => {
  if (!gameOver) checkRows();
  if (!gameOver) checkColumns();
  if (!gameOver) checkDiagonals();
  if (!gameOver) checkDraw();
};

// Add interactiveness

const takeTurn = (e) => {
  if (!e.target.textContent && !gameOver) {
    BoardController.insertMark(e.target, GameController.getActivePlayer());
    DisplayController.updateScreen();
    endGameChecks();

    if (!gameOver) {
      GameController.updateTurn();
      DisplayController.updateScreen();
    }
  }
};

const setListeners = () => {
  squares.forEach((square) => square.addEventListener('click', takeTurn));
};

const resetGame = (e) => {
  if (!(e == undefined) && e.type == 'keydown' && e.key != 'Tab') {
    console.log(e.type);
    return;
  }

  BoardController.resetGameBoard();
  GameController.resetTurns();
  DisplayController.updateScreen();

  if (replay.classList.contains('gameover')) {
    replay.classList.remove('gameover');
  }

  if (customize.classList.contains('gameover')) {
    customize.classList.remove('gameover');
  }

  gameOver = false;
  endType = '';
};

// Instantiate game

const initGame = () => {
  setListeners();
  replay.classList.remove('pregame');
  replay.textContent = 'Play Again';
  customize.classList.remove('pregame');

  replay.removeEventListener('click', initGame);
  replay.addEventListener('click', resetGame);
};

replay.addEventListener('click', initGame);

resetGame();

// Misc controls

const activateModal = (e) => {
  modal.classList.add('active');
  panel.style.visibility = 'hidden';
};

const closeWithSubmit = (e) => {
  e.preventDefault();
  playerUpdate();
  modal.classList.remove('active');
  numInput.value = '';
  textInput.value = '';
  panel.style.visibility = 'visible';
};

const exitModal = (e) => {
  if (e.key == 'Escape') {
    modal.classList.remove('active');
    numInput.value = '';
    textInput.value = '';
    panel.style.visibility = 'visible';
  }
};

const playerUpdate = () => {
  GameController.setPlayerName(parseInt(numInput.value), textInput.value);
  DisplayController.updateScreen();
};

customize.addEventListener('click', activateModal);

subButton.addEventListener('click', closeWithSubmit);

document.addEventListener('keydown', function (event) {
  if ((event.key = 'Enter')) {
    resetGame(event);
  }
});

document.addEventListener('keydown', function (event) {
  if ((event.key = 'Escape')) {
    exitModal(event);
  }
});

// Create players
// const Player = () => {
//   const name = '';
//   const mark = '';
// };
