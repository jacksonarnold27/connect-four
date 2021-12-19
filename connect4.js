/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // creating a board using global constants WIDTH and HEIGHT dimensions board[HEIGHT][WIDTH] 
  // (could be thought of as board[row][col])
  board = new Array(HEIGHT);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(WIDTH);
  }
  console.log('makeBoard(): executed.');
}
/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // set variable htmlBoard = HTML table DOM node
  let htmlBoard = document.getElementById('board');
  // top will be the very top row of the table, the header row in which the cells are contained
  // top is where the user will click to add new pieces to the board. the row itself will not hold pieces.
  let top = document.createElement("tr"); // create variable top = new tr (table row) element
  top.setAttribute("id", "column-top"); // set top's id: 'column-top'
  top.addEventListener("click", handleClick); // add event listener for click on tr element, calling handleClick

  for (let x = 0; x < WIDTH; x++) { // iterate through columns of board
    let headCell = document.createElement("td"); // create variable headCell = new td (data cell) element
    headCell.setAttribute("id", x); // set headCell's id: x, the current column
    top.append(headCell); // append headCell (td) to top (tr).
  }
  htmlBoard.append(top); // append top (tr) to htmlBoard (table)

  /* for loop iterates through each row and creates a table row element containing data cell elements in each column
    the data cell elements have an id: 'y-x' corresponding to that cell's coordinates in board[y][x]
    each row is then appended to htmlBoard to create the table */
  for (let y = 0; y < HEIGHT; y++) { // iterate through rows of board
    const row = document.createElement("tr"); // create variable row = new tr (table row) element
    for (let x = 0; x < WIDTH; x++) { // iterate through each column of each row
      const cell = document.createElement("td"); // create variable cell = new td (data cell) element
      cell.setAttribute("id", `${y}-${x}`); // set cell's id: y-x (the y, x coordinates of the cell)
      // EXAMPLE: cell is in the second row (y=1), fifth column(x=4). example cell's id: '1-4'
      // y-x : row-column
      row.append(cell); // append cell (td) to row (tr)
    }
    htmlBoard.append(row); // append row (tr) to htmlBoard (table)
  }
  console.log('makeHtmlBoard(): executed.');
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {// iterate through rows of the board, starting at the bottom
    if (board[y][x] == undefined) { // if the cell [y][x] is empty, return y
      console.log(`findSpotForCol(): cell[${y}][${x}] is empty.`);
      return y;
    }
    else { // if the cell [y][x] is NOT empty, continue
      console.log(`findSpotForCol(): cell[${y}][${x}] is already filled. Continuing...`);
      if (y === 0) return null;
    }
  }
  console.error('findSpotForCol(): failed to return y. THIS SHOULD NOT EXECUTE.');
}

/** placeInTable: update DOM to place piece into HTML table of board */
/* this function should add a div inside the correct td cell in the HTML game board. This div should
 have the piece class on it, and should have a class for whether the current player is 1 or 2, like p1 or p2 */

function placeInTable(y, x) {
  let player = 'p' + currPlayer; // player is a string that represents the current player (p1 or p2)
  let cellID = `${y}-${x}`; // cellID is a string that corresponds with the given cell's id
  let div = document.createElement('div'); // create variable div = new div element
  div.classList.add('piece', player); // add classes 'piece' and 'p1'/'p2' to div
  let cell = document.getElementById(cellID); // set variable cell = HTML td cell DOM node at board[y][x]
  cell.append(div); // append div to cell (td)
  console.log(`placeInTable(${y},${x}): executed.`);
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(() => {
    alert(msg);
  }, 50);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  for (let i = HEIGHT - 1; i >= 0; i--) { // iterate over each row in board, starting at bottom
    if (board[i].includes(undefined)) { // if the row includes an empty cell, exit for loop
      break;
    } // else if the top column is full, call endGame as a tie
    else if (i === 0) endGame("Stalemate! There's been a tie.");
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1; // if currPlayer is 1, switch to 2 and vice-versa
  console.log(`handleClick(evt): executed. The current player is now player ${currPlayer}.`);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }



  for (let y = 0; y < HEIGHT; y++) { // iterate over rows
    for (let x = 0; x < WIDTH; x++) { // iterate over columns
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // list of horizontal cells
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // list of vertical cells
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // list of diagonal (down right) cells 
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // list of diagonal (down left) cells

      // call local _win(cells) function on each list of cells. If any of the lists contain a win, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
