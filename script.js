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

renderGameBoard('playerBoard', playerBoard);
renderGameBoard('computerBoard', computerBoard);


//variables
let selectedShip = null;
let shipDirection = 'vertical';
let lastClick = 0;
let computerShipsPlaced = false;
const shipsPlaced = new Set();

const ships = document.querySelectorAll('.ship');
//event listener for ships//
//ADD ROTATE FUNCTION//

//event listener for cells + some placement logic//

ships.forEach(ship => {
    ship.addEventListener('click', function(event) {
        const firstClick = new Date().getTime();
        if (selectedShip === this && firstClick - lastClick < 300) {
            event.preventDefault();
            rotateShip(this);
        }
       selectedShip = this;
       lastClick = firstClick;
       shipBeingPlaced = this;
    })
})

const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
    cell.addEventListener('click', function() {
        if (selectedShip) {
            const [row, col] = this.id.split('-').slice(1).map(Number);
            const shipSize = parseInt(selectedShip.dataset.size);
            if(canPlacePlayerShip(row, col, shipSize, shipDirection)) {
                playerShip(row, col, shipSize, shipDirection)
                this.appendChild(shipBeingPlaced);

                shipBeingPlaced = null;
                selectedShip = null;
                shipsPlaced.add(this);
                if(shipsPlaced.size === ships.length) {
                    placeComputerShips();
                    computerClick();
                }
            } else {
                alert('Invalid cordinates!, please choose another location');
            }

        }
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
    selectedShip = null;
}

// function checks if the ship can be placed at a certain location//
function canPlacePlayerShip(row, col, size, direction) {
    if (direction === 'vertical' && (col+size) > 10)
    return false;
    if (direction === 'horizontal' && (row + size) > 10)
    return false;
for(let i = 0; i < size; i++) {
    if(direction === 'vertical') {
        if (playerBoard[row][col + i] !== null) 
        return false;
    } else {
        if(playerBoard[row + i][col] !== null)
        return false; 
    }
}
return true;
}

//place ship function for playerBoard

function playerShip(row, col, size, direction) {
        for (let i = 0; i < size; i++) {
            if (direction === 'vertical') {
              playerBoard[row][col + i] = 1;
            } else {
              playerBoard[row + i][col] = 1;
            }
          }
        }

        

//function to place computer ships on board//

function placeComputerShips() {
    const shipSizes = [5, 4, 3, 3, 2];
    for (const size of shipSizes) {
        while (true) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const direction = Math.random() < 0.5 ? 'vertical' : 'horizontal';
        if (canPlaceComputerShips(row, col, size, direction)) {
            placeComputerShip(row, col, size, direction);
            break;
                
            }
        }
    }
    computerShipsPlaced = true;
    console.log('ships placed by computer');
}

function placeComputerShip(row, col, size, direction) {
    for (let i = 0; i < size; i++) {
        if (direction === 'vertical') {
            computerBoard[row + i][col] = 1;
            } else {
                computerBoard[row][col + i] = 1;
                }
             }
        }
//same function from player ship//
function canPlaceComputerShips(row, col, size, direction) {
    if (direction === 'vertical' && (col + size) > 10)
    return false;
    if (direction === 'horizontal' && (row + size) > 10)
    return false;
for(let i = 0; i < size; i++) {
    if(direction === 'vertical') {
        if (row + i >= 10 || computerBoard[row + i][col] === 1)
        return false;
    } else {
        if (col + i >= 10 || computerBoard[row][col + i] === 1)
        return false; 
    }
}
return true;
}
//Once board is clicked computer ships are placed//
document.addEventListener('click', function() {
    if (!computerShipsPlaced && shipsPlaced.size === ships.length) {
        console.log('Placing computer ships condition met');
        placeComputerShips();
        computerClick();
    }
});
// display event message//

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.classList.add('active');
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 1000);
}


// hit and miss logic//

let hitCounter = 0;
const totalHits = 17;



const computerCells = document.querySelectorAll('#computerBoard .cell');
computerCells.forEach( cell => {
    cell.addEventListener('click', function() {
        const[row, col] = this.id.split('-').slice(1).map(Number);
        if (computerBoard[row][col] === 1) {
            this.classList.add('hit');
            displayMessage('Hit!');
            playerBoard[row][col] = 'X';
        } else {
            this.classList.add('miss');
            displayMessage('Miss!');
        }
        if (hitCounter === totalHits) {
            displayMessage('BETTER LUCK NEXT TIME, ALL SHIPS SUNK!');
        }
        computerClick();
    })
})

//hit and miss logic for player board cells//
let selectedGridPoints = new Set();
function computerClick() {
    const playerCells = document.querySelectorAll('#playerBoard .cell');
    let randomIndex = Math.floor(Math.random() * playerCells.length);
    let cell = playerCells[randomIndex];
    let [row, col] = cell.id.split('-').slice(1).map(Number);

    while (selectedGridPoints.has(`${row}-${col}`)) {
        randomIndex = Math.floor(Math.random() * playerCells.length);
        cell = playerCells[randomIndex];
        const [newRow, newCol] = cell.id.split('-').slice(1).map(Number);
        row = newRow;
        col = newCol;
    }
    selectedGridPoints.add(`${row}-${col}`);
    cell.click();
}

const playerCells = document.querySelectorAll('#playerBoard .cell');
playerCells.forEach(cell => {
    cell.addEventListener('click', function() {
        const [row, col] = this.id.split('-').slice(1).map(Number);
        if (playerBoard[row][col] === 1) {
            this.classList.add('hit');
            displayMessage('You got hit!');
            playerBoard[row][col] = 'X';
            hitCounter++;
            if (hitCounter === totalHits) {
                displayMessage('CONGRATULATIONS! ALL SHIPS HAVE BEEN SUNK!');
            }
        } else {
            this.classList.add('miss');
            displayMessage('You dodged the shot!');
        }
    
    })
})

 

