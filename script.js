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
let shipDirection = 'vertical';
lastClick = 0;

const ships = document.querySelectorAll('.ship');
//event listener for ships//
//ADD ROTATE FUNCTION//
ships.forEach(ship => {
    ship.addEventListener('click', function(event) {
        const firstClick = new Date().getTime();
        if (selectedShip === this && firstClick - lastClick < 300) {
            event.preventDefault();
            rotateShip(this);
        }
       selectedShip = ship;
       lastClick = firstClick;
    })
})

function rotateShip(ship) {
    if(ship.classList.contains('vertical')) {
        ship.classList.remove('vertical');
        ship.classList.add('horizontal');
    } else {
        ship.classList.remove('horizontal');
        ship.classList.add('vertical');
    }
    selectedShip = ship;
}
//event listener for cells + some placement logic//
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', function() {
        if (selectedShip) {
            const [row, col] = this.id.split('-').slice(1).map(Number);
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
// function checks if the ship can be placed at a certain location//
function canPlaceShip(row, col, size, direction) {
    if (direction === 'vertical' && col+size > 10)
    return false;
    if (direction === 'horizontal' && row + size > 10)
    return false;
for(let i = 0; i < size; i++) {
    if(direction === 'vertical') {
        if(playerBoard[row][col + i] !== null) 
        return false;
    } else {
        if(playerBoard[row + i][col] !== null)
        return false; 
    }
}
return true;
}
//place ship function for playerBoard
function placeShip(row, col, size, direction) {
        for (let i = 0; i < size; i++) {
            if (direction === 'vertical') {
              playerBoard[row][col + i] = 'ship';
            } else {
              playerBoard[row + i][col] = 'ship';
            }
          }
        }
 
