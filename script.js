//function to render game boards//
const playerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));
const computerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

function renderGameBoard(gameBoard, board) {
  const boardElement = document.getElementById(gameBoard);
  boardElement.innerHTML = ''; 
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = `${String.fromCharCode(65 + row)}${col + 1}`;
      boardElement.appendChild(cell);
    }
  }
}

renderGameBoard('playerBoard');
renderGameBoard('computerBoard');

//variables
const selectedShip = null;
const shipDirection = 'horizontal';

const ships = document.querySelectorAll('ship');
//event listener for ships//
ships.forEach(ship => {
    ship.addEventListener('click' function() {
        selectedShip = this;
    })
})