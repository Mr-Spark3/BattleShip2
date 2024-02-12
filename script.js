const shipData = [
    { class: 'Carrier', size: 5 },
    { class: 'Destroyer', size: 2 },
    { class: 'Battleship', size: 4 },
    { class: 'Cruiser', size: 3 },
    { class: 'Submarine', size: 3 }
];

// Function to render game boards
const playerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));
const computerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

// Function to render game boards
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

// Get ships
const ships = document.querySelectorAll('.ship');
const shipSizes = Array.from(ships).map(ship => parseInt(ship.dataset.size));

// Variables
let selectedShip = null;
let shipDirection = 'vertical';
let lastClick = 0;
let computerShipsPlaced = false;
const shipsPlaced = new Set();
let shipBeingPlaced = null;

// Add event listeners for ships
ships.forEach(ship => {
    let clickCount = 0;
    let lastClickTime = 0;

    ship.addEventListener('click', function(event) {
        const clickTime = new Date().getTime();
        if (clickTime - lastClickTime < 300) {
            clickCount++;
        } else {
            clickCount = 1;
        }

        lastClickTime = clickTime;

        if (clickCount === 2) {
            rotateShip(this);
            clickCount = 0;
        } else {
            selectedShip = this;
            shipBeingPlaced = this;
        }
    });
});
// Add event listeners for cells
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', function() {
        if (selectedShip) {
            const [row, col] = this.id.split('-').slice(1).map(Number);
            const shipSize = parseInt(selectedShip.dataset.size);
            if (canPlacePlayerShip(row, col, shipSize, shipDirection)) {
                playerShip(row, col, shipSize, shipDirection);
                this.appendChild(shipBeingPlaced);

                shipBeingPlaced = null;
                selectedShip = null;
                shipsPlaced.add(this);
                if (shipsPlaced.size === ships.length) {
                    placeComputerShips();
                    computerClick();
                }
            } else {
                displayMessage('Invalid coordinates! Please choose another location.');
            }
        }
    });
});

// Function to rotate ship
function rotateShip(ship) {
    console.log('Rotating ship...');
    if (ship.classList.contains('vertical')) {
        console.log('Rotating to horizontal');
        ship.classList.remove('vertical');
        ship.classList.add('horizontal');
        ship.dataset.direction = 'horizontal'; 
    } else {
        console.log('Rotating to vertical');
        ship.classList.remove('horizontal');
        ship.classList.add('vertical');
        ship.dataset.direction = 'vertical'; 
    }
    selectedShip = null;
}
// Function to check if the ship can be placed at a certain location
function canPlacePlayerShip(row, col, size, direction) {
    if (direction === 'vertical' && col + size > 10) return false;
    if (direction === 'horizontal' && row + size > 10) return false;
    for (let i = 0; i < size; i++) {
        if (direction === 'vertical') {
            if (col + i >= 10 || (playerBoard[row + i][col] !== null && playerBoard[row + i][col] !== 0)) return false;
        } else {
            if (row + i >= 10 || (playerBoard[row][col + i] !== null && playerBoard[row][col + i] !== 0)) return false;
        }
    }
    return true;
}

// Place ship function for playerBoard
const playerShipsCoordinates = [];

// Place ship function for playerBoard
function playerShip(row, col, size, direction) {
    const ship = document.createElement('div');
    ship.className = 'ship';
    ship.dataset.size = size;

    const shipCoordinates = []; 

    for (let i = 0; i < size; i++) {
        if (direction === 'vertical') {
            playerBoard[row + i][col] = 1;
            shipCoordinates.push([row + i, col]);
            console.log(`Ship placed at row: ${row + i}, col: ${col}`);
        } else {
            playerBoard[row][col + i] = 1;
            shipCoordinates.push([row, col + i]);
            console.log(`Ship placed at row: ${row}, col: ${col + i}`);
        }
    }

    ship.style.position = 'absolute';
    ship.style.width = direction === 'vertical' ? '20px' : `${size * 20}px`;
    ship.style.height = direction === 'vertical' ? `${size * 20}px` : '20px';
    ship.style.left = `${col * 20}px`;
    ship.style.top = `${row * 20}px`;

    document.getElementById('playerBoard').appendChild(ship);

    playerShipsCoordinates.push(shipCoordinates);
}

// Function to check if a ship can be placed on the computer's board
function canPlaceComputerShips(row, col, size, direction) {
    console.log(`Checking if ship of size ${size} can be placed at row ${row}, col ${col}, direction ${direction}`);
    if (direction === 'vertical' && row + size > 10) {
        console.log('Ship exceeds board height');
        return false;
    }
    if (direction === 'horizontal' && col + size > 10) {
        console.log('Ship exceeds board width');
        return false;
    }
    for (let i = 0; i < size; i++) {
        if (direction === 'vertical') {
            if (row + i >= 10 || computerBoard[row + i][col] === 1) {
                console.log(`Ship cannot be placed at row ${row + i}, col ${col}`);
                return false;
            }
        } else {
            if (col + i >= 10 || computerBoard[row][col + i] === 1) {
                console.log(`Ship cannot be placed at row ${row}, col ${col + i}`);
                return false;
            }
        }
    }
    return true;
}

// Function to place computer ships on the board
function placeComputerShips() {
    console.log('Placing computer ships...');
    playerShipsCoordinates.length = 0;

    for (const size of shipSizes) {
        console.log(`Placing ship of size ${size}`);
        while (true) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const direction = Math.random() < 0.5 ? 'vertical' : 'horizontal';
            if (canPlaceComputerShips(row, col, size, direction)) {
                placeComputerShip(row, col, size, direction);
                console.log(`Ship of size ${size} placed at row ${row}, col ${col}, direction ${direction}`);
                break;
            }
        }
    }

    computerShipsPlaced = true;
    console.log('Ships placed by the computer');
}

// Once board is clicked, computer ships are placed
document.addEventListener('click', function() {
    if (!computerShipsPlaced && shipsPlaced.size === ships.length) {
        console.log('Placing computer ships condition met');
        placeComputerShips();
        computerClick();
        console.log('Player ships coordinates:', playerShipsCoordinates);
    }
});

// Function to place a computer ship
function placeComputerShip(row, col, size, direction) {
    for (let i = 0; i < size; i++) {
        if (direction === 'vertical') {
            computerBoard[row + i][col] = 1;
        } else {
            computerBoard[row][col + i] = 1;
        }
    }
}

// Function to display messages
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.classList.add('active');
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 1000);
}

// Hit and miss logic

let hitCounter = 0;
const totalHits = 17;

const computerCells = document.querySelectorAll('#computerBoard .cell');
computerCells.forEach(cell => {
    cell.addEventListener('click', function() {
        const [row, col] = this.id.split('-').slice(1).map(Number);
        if (computerBoard[row][col] === 1) {
            this.classList.add('hit');
            displayMessage('Hit!');
            computerBoard[row][col] = 'X';
            hitCounter++;
            if (hitCounter === totalHits) {
                displayMessage('BETTER LUCK NEXT TIME, ALL SHIPS SUNK!');
            }
        } else {
            this.classList.add('miss');
            displayMessage('Miss!');
        }
        if (allShipsSunk(computerBoard)) {
            displayMessage('CONGRATULATIONS! YOU SUNK ALL COMPUTER SHIPS!');
        } else {
            computerClick();
        }
    });
});

const playerCells = document.querySelectorAll('#playerBoard .cell');
playerCells.forEach(cell => {
    cell.addEventListener('click', function() {
        const [row, col] = this.id.split('-').slice(1).map(Number);
        if (selectedShip) {
            const shipSize = parseInt(selectedShip.dataset.size);
            if (canPlacePlayerShip(row, col, shipSize, shipDirection)) {
                playerShip(row, col, shipSize, shipDirection);
                this.appendChild(shipBeingPlaced);

                shipBeingPlaced = null;
                selectedShip = null;
                shipsPlaced.add(this);
                if (shipsPlaced.size === ships.length) {
                    placeComputerShips(); 
                    computerClick(); 
                }
            } else {
                displayMessage('Invalid coordinates! Please choose another location.');
            }
        }
    });
});

// Hit and miss logic for player board cells
function computerClick() {
    const [row, col] = generateRandomCoordinates();
    const cellId = `cell-${row}-${col}`;
    const cell = document.getElementById(cellId);
    if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
        if (playerBoard[row][col] === 1) {
            cell.classList.add('hit');
            displayMessage('Computer hit your ship!');
            playerBoard[row][col] = 'X';
            hitCounter++;
            if (hitCounter === totalHits) {
                displayMessage('CONGRATULATIONS! ALL SHIPS HAVE BEEN SUNK!');
            }
        } else {
            cell.classList.add('miss');
            displayMessage('Computer missed!');
        }
    } else {
        computerClick();
        return; 
    }

    // Update the hits on the player's ships
    const shipCoordinates = playerShipsCoordinates.flat(); 
    const hitShip = shipCoordinates.find(coord => coord[0] === row && coord[1] === col); 
    if (hitShip) {
        const [hitRow, hitCol] = hitShip;
        const shipElement = document.querySelector(`#playerBoard .ship[data-size="${hitCounter}"]`);
        if (shipElement) {
            const direction = shipElement.dataset.direction;
            const offset = direction === 'vertical' ? hitRow - row : hitCol - col;
            const hitCells = shipElement.querySelectorAll('.cell');
            hitCells.forEach((cell, index) => {
                if (direction === 'vertical') {
                    cell.classList.add('hit');
                    playerBoard[hitRow - index][hitCol] = 'X';
                } else {
                    cell.classList.add('hit');
                    playerBoard[hitRow][hitCol - index] = 'X';
                }
            });
        }
    }
}

// Function to check if all ships of a given board are sunk
function allShipsSunk(board) {
    let shipCount = 0;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 1) {
                shipCount++;
            }
        }
    }
    return shipCount === 0;
}

// Function to generate random coordinates for computer click
function generateRandomCoordinates() {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    return [row, col];
}

// Function to reset the game
function resetGame() {
    for (let row = 0; row < playerBoard.length; row++) {
        for (let col = 0; col < playerBoard[row].length; col++) {
            playerBoard[row][col] = null;
            computerBoard[row][col] = null;
        }
    }

        // Event listener for resetting the game
document.addEventListener('DOMContentLoaded', function() {
    const resetButton = document.getElementById('playGame'); 
    playGame.addEventListener('click', resetGame);
});

    // Reset variables
    selectedShip = null;
    shipDirection = 'vertical';
    lastClick = 0;
    computerShipsPlaced = false;
    shipsPlaced.clear();
    shipBeingPlaced = null;
    hitCounter = 0;

    // Clear ship placements on the DOM
    const playerCells = document.querySelectorAll('#playerBoard .cell');
    playerCells.forEach(cell => {
        cell.innerHTML = '';
    });

    const computerCells = document.querySelectorAll('#computerBoard .cell');
    computerCells.forEach(cell => {
        cell.classList.remove('hit', 'miss');
    });

    // Remove ships from the DOM and re-append them to the container
    const playerShipsContainer = document.getElementById('playerBoard');
    const playerShips = document.querySelectorAll('.ship');
    playerShips.forEach(ship => {
        playerShipsContainer.appendChild(ship);
    });



    // Render game boards
    renderGameBoard('playerBoard', playerBoard);
    renderGameBoard('computerBoard', computerBoard);
}