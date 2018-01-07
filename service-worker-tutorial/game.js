
// Define dimensions of the grid. Defaukt is 3x3. Thinking time currenly only used for effect and does not impact AI.
const GRID_SIZE = 3;
const THINKING_TIME = 300;

var playerTurn = true; // Tracks whether it is the player's turn.
var grid = []; // This will be a two-dimensional array to store the game state.

// Strings used to dynamically display game outcomes.
const player_victory_string = "Well done. You won!";
const computer_victory_string = "Bad luck. The computer won.";
const draw_string = "It's a draw.";

// When we load the module, dynamically generate a game grid and add it to the page.
createGrid();

// This function generates a set of squates ("cells") based ont he chosen grid dimensions.
// The resulting grid is added to the page and stored in the grid[][] array.
function createGrid()
{
  var gameArea = document.getElementById("game");
  for (var i = 0; i < GRID_SIZE; i++) {
    grid.push(new Array());
    var row = document.createElement("tr");
    gameArea.appendChild(row);
    for (var j = 0; j < GRID_SIZE; j++) {
      var cell = document.createElement("td");
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.dataset.state = "";
      cell.className = "cell";
      cell.addEventListener("click", function() {
        clickCell(this);
      });
      grid[i].push(cell);
      row.appendChild(cell);
    }
  }
}

// If it is the player's turn and they click a cell, check if it's available.
// If it is available, update its state and switch to the computer's turn.
// We also test for victory to determine if the game is over.
function clickCell(cell)
{
  if (playerTurn && (cell.dataset.state == "")) {
    cell.dataset.state = "X";
    cell.innerHTML = "X";
    cell.className += " player-cell";
    playerTurn = false;
    if (victoryTest(cell.dataset.x, cell.dataset.y)) {
      document.getElementById("victory-status").innerHTML = player_victory_string;
    } else {
      setTimeout(function() {
        computerPlay();
      }, THINKING_TIME);
    }
  }
}

// If it is the computer's turn, have them select a cell.
// Currently we implement no AI but select a random cell from those which are still available.
// We also test for victory to determine if the game is over.
function computerPlay()
{
  var remainingCells = [];
  var currentCell;
  var chosenCell
  for (i = 0; i < grid.length; i++) {
    for (j = 0; j < grid[i].length; j++) {
      currentCell = grid[i][j];
      if (currentCell.dataset.state == "") {
        remainingCells.push(currentCell);
      }
    }
  }
  if (remainingCells.length > 0) {
    chosenCell = remainingCells[Math.floor(Math.random() * remainingCells.length)];
    chosenCell.dataset.state = "O";
    chosenCell.innerHTML = "O";
    chosenCell.className += " computer-cell";
    if (victoryTest(chosenCell.dataset.x, chosenCell.dataset.y)) {
      document.getElementById("victory-status").innerHTML = computer_victory_string;
    } else {
      playerTurn = true;
    }
  } else {
    document.getElementById("victory-status").innerHTML = draw_string;
  }
}

// The victory test examines the horixontal and vertical rows of the most recently clicked square.
// It also examines both forward and reverse diagonals.
// The game is over if any of the above are complete roms of the same state.
// We can then assume whoever played the most recent turn to have won.
function victoryTest(x, y)
{
  var row = "";
  // Test for horizontal row
  for(var j = 0; j < grid[x].length; j++) {
    row += grid[x][j].dataset.state;
  }
  var column = "";
  // Test for horizontal row
  for(var i = 0; i < grid.length; i++) {
    column += grid[i][y].dataset.state;
  }
  var diagonal = ""
  for (var d = 0; d < grid.length; d++) {
    diagonal += grid[d][d].dataset.state;
  }
  var reverse_diagonal = ""
  for (var d = 0; d < grid.length; d++) {
    reverse_diagonal += grid[grid.length - d - 1][d].dataset.state;
  }
  return (checkArray(row) && (row.length == grid.length))
      || (checkArray(column) && (column.length == grid.length))
      || (checkArray(diagonal) && (diagonal.length == grid.length))
      || (checkArray(reverse_diagonal) && (reverse_diagonal.length == grid.length));
}

// This utility function determins if an array is composed entirely of the same character.
// (eg. XXX or OOO)
function checkArray(array) {
  for(var i = 1; i < array.length; i++)
  {
    if(array[i] !== array[0])
    return false;
  }
  return true;
}

// This function restarts the game by clearing the game area and generating a brand new grid.
function reset()
{
  var gameArea = document.getElementById("game");
  while (gameArea.firstChild) {
    gameArea.removeChild(gameArea.firstChild);
  }
  document.getElementById("victory-status").innerHTML = "";
  grid = [];
  createGrid();
  playerTurn = true;
}
