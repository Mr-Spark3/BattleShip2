//function to render game boards//
const playerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));
const computerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

function renderGameBoard(gameBoard, board) {
  const boardElement = document.getElementById(gameBoard);
  boardElement.innerHTML = ''; 
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cellId = `cell-${row}-${col}`;
      const cell = document.createElement('div');
      cell.id = cellId;
      cell.className = 'cell';
      cell.textContent = `${String.fromCharCode(65 + row)}${col + 1}`;
      boardElement.appendChild(cell);
    }
  }
}

renderGameBoard('playerBoard');
renderGameBoard('computerBoard');

//variables
let selectedShip = null;
//NEED TO ADD ROTATION//
let shipDirection = 'vertical';

const ships = document.querySelectorAll('.ship');
//event listener for ships//
ships.forEach(ship => {
    ship.addEventListener('click', function() {
        selectedShip = this;
    })
})

const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', function() {
        if (selectedShip) {
            const [row, col] = cellId.split('-').slice(1).map(Number);
            const shipSize = parseInt(selectedShip.dataset.size);
            if(canPlaceShip(row, col, shipSize, shipDirection)) {
                placeShip(row, col, shipSize, shipDirection)
                this.appendChild(selectedShip);

                selectedShip = null;
            } else {
                alert('Invalid cordinates!, please choose another location')
            }

        }
    })
})
