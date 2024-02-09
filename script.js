//function to render game boards//
const playerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));
const computerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

function renderGameBoard(boardId, board) {
  const boardElement = document.getElementById(boardId);
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

  const shipTypes = {
    Carrier: { size: 5 },
    Battleship: { size: 4 },
    Cruiser: { size: 3 },
    Submarine: { size: 3 },
    Destroyer: { size: 2 }
  };
  
 