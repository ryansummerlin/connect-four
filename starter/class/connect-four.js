const Screen = require("./screen");
const Cursor = require("./cursor");

class ConnectFour {

  constructor() {

    this.playerTurn = "O";

    this.grid = [[' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ']]

    this.cursor = new Cursor(6, 7);

    // Initialize a 6x7 connect-four grid
    Screen.initialize(6, 7);
    Screen.setGridlines(true);

    Screen.addCommand('h', 'Print list of commands', Screen.printCommands);
    Screen.addCommand('l', 'Move cursor left', this.cursorLeft);
    Screen.addCommand('r', 'Move cursor right', this.cursorRight);
    Screen.addCommand('p', 'Place a move in the selected column', this.placeMove);

    this.cursor.row = this.cursor.numRows - 1;
    this.cursor.setBackgroundColor();
    Screen.render();
  }

  cursorLeft = () => {
    this.cursor.left();
    this.cursorDown();
  }

  cursorRight = () => {
    this.cursor.right();
    this.cursorDown();
  }

  switchPlayer() {
    if (this.playerTurn === 'X') {
      this.playerTurn = 'O';
    } else {
      this.playerTurn = 'X';
    }
  }

  cursorDown = () => {
    this.cursor.resetBackgroundColor();
    this.cursor.row = this.cursor.numRows - 1;
    while (!(this.grid[this.cursor.row][this.cursor.col] === ' ') && this.cursor.row > 0) {
      this.cursor.up();
    }
    this.cursor.setBackgroundColor();
    Screen.render();
  }

  placeMove = () => {
    this.cursorDown();
    if (this.grid[this.cursor.row][this.cursor.col] === ' ') {
      Screen.setGrid(this.cursor.row, this.cursor.col, this.playerTurn);
      this.grid[this.cursor.row][this.cursor.col] = this.playerTurn;

      this.switchPlayer();
      let win = ConnectFour.checkWin(this.grid);
      if (win) {
        ConnectFour.endGame(win);
      }
      Screen.setMessage(`It is ${this.playerTurn}'s turn`);
    } else if (!(this.cursor.row === 0)) {
      this.cursor.up();
      this.placeMove();
    } else {
      Screen.setMessage("You can't move there. Choose an open spot");
    }

    this.cursorDown();
    Screen.render();
  }

  static horizontalWinner(grid) {
    let horizontalWin = grid.map(el => {
      for (let i = 0; i < el.length - 3; i++) {
        if (el[i] === 'X' && el[i + 1] === 'X' && el[i + 2] === 'X' && el[i + 3] === 'X') {
          return 'X';
        }
        if (el[i] === 'O' && el[i + 1] === 'O' && el[i + 2] === 'O' && el[i + 3] === 'O') {
          return 'O';
        }
      }
      return null;
    });

    return horizontalWin;
  }

  static verticalWinner(grid) {
    let verticalWin = [];
    for (let i = 0; i < grid.length - 3; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] === 'X' && grid[i + 1][j] === 'X' && grid[i + 2][j] === 'X' && grid[i + 3][j] === 'X') {
          verticalWin.push('X');
        }
        if (grid[i][j] === 'O' && grid[i + 1][j] === 'O' && grid[i + 2][j] === 'O' && grid[i + 3][j] === 'O') {
          verticalWin.push('O');
        }
      }
    }
      return verticalWin;
  }

  static downwardDiagonalWinner(grid) {
    let downwardDiagonalWin = [];
    for (let i = 0; i < grid.length - 3; i++) {
      for (let j = 0; j < grid[0].length - 3; j++) {
        if (grid[i][j] === 'X' && grid[i + 1][j + 1] === 'X' && grid[i + 2][j + 2] === 'X' && grid[i + 3][j + 3] === 'X') {
          downwardDiagonalWin.push('X');
        }
        if (grid[i][j] === 'O' && grid[i + 1][j + 1] === 'O' && grid[i + 2][j + 2] === 'O' && grid[i + 3][j + 3] === 'O') {
          downwardDiagonalWin.push('O');
        }
      }
    }
    return downwardDiagonalWin;
  }

  static upwardDiagonalWinner(grid) {
    let upwardDiagonalWin = [];
    for (let i = grid.length - 1; i > 3; i--) {
      for (let j = 0; j < grid[0].length - 3; j++) {
        if (grid[i][j] === 'X' && grid[i - 1][j + 1] === 'X' && grid[i - 2][j + 2] === 'X' && grid[i - 3][j + 3] === 'X') {
          upwardDiagonalWin.push('X');
        }
        if (grid[i][j] === 'O' && grid[i - 1][j + 1] === 'O' && grid[i - 2][j + 2] === 'O' && grid[i - 3][j + 3] === 'O') {
          upwardDiagonalWin.push('O');
        }
      }
    }
    return upwardDiagonalWin;
  }

  static checkWin(grid) {
    let emptyGrid = grid.map(el => el.includes('O') || el.includes('X'));
    let tie = grid.map(el => el.includes(' '));

    let horizontalWin = ConnectFour.horizontalWinner(grid);
    let verticalWin = ConnectFour.verticalWinner(grid);
    let downwardDiagonalWin = ConnectFour.downwardDiagonalWinner(grid);
    let upwardDiagonalWin = ConnectFour.upwardDiagonalWinner(grid);

    let winner = [...horizontalWin, ...verticalWin, ...downwardDiagonalWin, ...upwardDiagonalWin];

    if (!emptyGrid.includes(true)) {
      return false;
    } else if (winner.includes('X')) {
      return 'X';
    } else if (winner.includes('O')) {
      return 'O';
    } else if (!tie.includes(true)) {
      return 'T';
    } else {
      return false;
    }


    // Return 'X' if player X wins
    // Return 'O' if player O wins
    // Return 'T' if the game is a tie
    // Return false if the game has not ended

  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = ConnectFour;
