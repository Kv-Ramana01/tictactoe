const GameBoard = (() => {
  const rows = 3;
  const cols = 3;

  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  const markToken = (row, col, player) => {
    if (board[row][col].getValue() === 0) {
      board[row][col].addToken(player);
      return true;
    }
    console.log("invalid move");
    return false;
  };

  const printBoard = () => {
    const viewBoard = board.map((row) => {
      return row.map((cell) => cell.getValue());
    });
    console.log(viewBoard);
  };

  const boardReset = () => {
    board.forEach((row) => row.forEach((cell) => cell.reset()));
  };

  const checkWinningCondition = () => {
    const viewboard = board;

    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;

      let val1 = viewboard[a[0]][a[1]].getValue();
      let val2 = viewboard[b[0]][b[1]].getValue();
      let val3 = viewboard[c[0]][c[1]].getValue();

      if (val1 !== 0 && val1 === val2 && val2 === val3) {
        return val1;
      }
    }

    return null;
  };

  return { getBoard, markToken, printBoard, boardReset, checkWinningCondition };
})();

function cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  };
  const getValue = () => value;
  const reset = () => (value = 0);
  return { addToken, getValue, reset };
}

const winningPatterns = [
  // rows
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],

  // cols
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],

  // diagonals
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

function checkTieCondition() {
  const isFull = !GameBoard.getBoard()
    .flat()
    .some((cell) => cell.getValue() === 0);
  return isFull;
}

const GameController = ((
  player1Name = "player 1",
  player2Name = "player 2",
) => {
  let gameOver = false;
  let previousWinner = null;
  const players = [
    {
      name: player1Name,
      token: "X",
    },
    {
      name: player2Name,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerturn = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const printNewRound = () => {
    GameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (row, col) => {
    if (gameOver) {
      console.log("Game is over. Restart to play again.");
      return;
    }
    let valid = GameBoard.markToken(row, col, activePlayer.token);

    if (valid) {
      let winner = GameBoard.checkWinningCondition();
      if (winner) {
        console.log(`${activePlayer.name} won!!`);
        gameOver = true;
        previousWinner = winner;
        GameBoard.printBoard();

        console.log("Game is over. Restart to play again.");
        return;
      } else if (checkTieCondition()) {
        console.log(`It's a tie!`);
        gameOver = true;
        GameBoard.printBoard();

        console.log("Game is over. Restart to play again.");
        return;
      }
      switchPlayerturn();
      printNewRound();
    } else {
      console.log("Make a valid move.");
      GameBoard.printBoard();
    }
  };

  printNewRound();

  const restartGame = () => {
    GameBoard.boardReset();
    if (previousWinner !== null) {
      switchPlayerturn();
    }
    previousWinner = null;

    printNewRound();
    gameOver = false;
  };

  return {
    playRound,
    getActivePlayer,
    restartGame,
  };
})();
