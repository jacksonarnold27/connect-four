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
  // set variable htmlBoard to the HTML board DOM node
  let htmlBoard = document.getElementById('board');
  // top will be the very top row of the table, the header row in which the cells are contained
  let top = document.createElement("tr"); // create variable top = tr (table row) element
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
    const row = document.createElement("tr"); // create variable row = tr (table row) element
    for (let x = 0; x < WIDTH; x++) { // iterate through each column of each row
      const cell = document.createElement("td"); // create variable cell = td (data cell) element
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
  for (let y = 0; y < HEIGHT; y++) { // iterate through rows of the board, starting at the top
    if (board[y][x] == null) { // if the cell [y][x] is empty, do nothing--unless...
      if (y == HEIGHT - 1) return y; // if y is the last row of the board, return y
    }
    else { // if the cell [y][x] is NOT empty
      return y === 0 ? null : y; // if the column is completely filled, return null. Otherwise, return y
    }
  }
  console.error('findSpotForCol(): failed to return y. THIS SHOULD NOT EXECUTE.');
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
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
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  // TODO: switch currPlayer 1 <-> 2
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

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
