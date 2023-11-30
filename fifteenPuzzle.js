/* ------EXTRA FEATURES------------
End-of-game notification: Provide some sort of visual notification when the game has been won;
that is, when the tiles have been rearranged into their original order

Multiple backgrounds: Provide several background images (at least 4) to choose from.


Please Grade This Option: 
Different puzzle sizes: Place a control on the board to allow the game to be broken apart in other
sizes besides 4x4, such as 3x3, 6x6, 8x8, 10x10 etc. 

Cheat button: This will solve and show the shuffle that was created not a static page to display
the titles in order
*/

var moves = 0;
var table;
var rows;
var columns;
var textMoves;
var arrayForBoard;
var originalBoard;
var selectedBackground = "background2.jpg"; // Default background

function start() {
    var button = document.getElementById("newGame");
    button.addEventListener("click", startNewGame, false);
    textMoves = document.getElementById("moves");
    table = document.getElementById("table");
    rows = 4;
    columns = 4;
    startNewGame();
    setTileBackground();

}

function changeBackground() {
    var backgroundSelect = document.getElementById("backgroundSelect");
    selectedBackground = backgroundSelect.value;
    setTileBackground();
}

function startNewGame() {
    moves = 0;
    rows = parseInt(document.getElementById("rows").value);
    columns = parseInt(document.getElementById("columns").value);
    textMoves.innerHTML = moves;

    originalBoard = createFixedBoard(rows, columns);
    arrayForBoard = shuffleBoard(originalBoard);

    showTable();
    setTileBackground();
}

function createFixedBoard(rows, columns) {
    var arrayForBoard = new Array(rows);
    var count = 1; // tile number

    for (var i = 0; i < rows; i++) {
        arrayForBoard[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            arrayForBoard[i][j] = count++;
        }
    }
    arrayForBoard[rows - 1][columns - 1] = 0; // Empty space (last spcace/tile)

    return arrayForBoard; // 2D array
}

function shuffleBoard(board) {
    var shuffledBoard = board.slice().flat(); // Flatten and copy the original board & works with a 1D array
    for (var i = shuffledBoard.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [shuffledBoard[i], shuffledBoard[j]] = [shuffledBoard[j], shuffledBoard[i]]; // Swap elements
    }
    return chunkArray(shuffledBoard, columns);
}

function chunkArray(array, size) {
    var result = [];
    for (var i = 0; i < array.length; i += size) { //making the rows
        //push adds entire rows to array
        result.push(array.slice(i, i + size)); //adding elements to the each row; making the columns from 1D array;
    }
    return result; // 2D array
}

function showTable() {
    var outputString = "";
    for (var i = 0; i < rows; i++) {
        outputString += "<tr>";
        for (var j = 0; j < columns; j++) {
            if (arrayForBoard[i][j] === 0) {
                outputString += "<td class=\"blank\"> </td>";
            } else {
                outputString += "<td class=\"tile\" onclick=\"moveThisTile(" + i + ", " + j + ")\">" + arrayForBoard[i][j] + "</td>";
            }
        }
        outputString += "</tr>";
    }
    table.innerHTML = outputString;
}

function moveThisTile(tableRow, tableColumn) {
    var directions = ["up", "down", "left", "right"];
    for (var i = 0; i < directions.length; i++) {
        if (checkIfMoveable(tableRow, tableColumn, directions[i])) {
            incrementMoves();
            break; // Exit loop if a valid move is found
        }
    }

    if (checkIfWinner()) {
        alert("Congratulations! You solved the puzzle in " + moves + " moves.");
        startNewGame();



    }
}

function checkIfMoveable(rowCoordinate, columnCoordinate, direction) {
    var rowOffset = 0;
    var columnOffset = 0;
    if (direction === "up") {
        rowOffset = -1;
    } else if (direction === "down") {
        rowOffset = 1;
    } else if (direction === "left") {
        columnOffset = -1;
    } else if (direction === "right") {
        columnOffset = 1;
    }

    var newRow = rowCoordinate + rowOffset;
    var newColumn = columnCoordinate + columnOffset;

    if (newRow >= 0 && newColumn >= 0 && newRow < rows && newColumn < columns) {
        if (arrayForBoard[newRow][newColumn] === 0) {
            arrayForBoard[newRow][newColumn] = arrayForBoard[rowCoordinate][columnCoordinate];
            arrayForBoard[rowCoordinate][columnCoordinate] = 0;


            showTable();
            setTileBackground(); // Add this line to set the background after a move
            return true;
        }
    }

    return false;
}


// Update the checkIfWinner function to show the win image when the game is won
// Update the checkIfWinner function to change the background when the game is won
function checkIfWinner() {
    var isWinner = true;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            if (arrayForBoard[i][j] !== originalBoard[i][j]) {
                isWinner = false;
                break;
            }
        }
        if (!isWinner) {
            break;
        }
    }

    if (isWinner) {
        document.body.style.background = 'url(winner.jpg) no-repeat center center fixed';
        document.body.style.backgroundSize = 'auto';
    }

    return isWinner;
}


function incrementMoves() {
    moves++;
    textMoves.innerHTML = moves;
}

function setTileBackground() {
    var tiles = document.querySelectorAll('.tile');
    var tileSize = 50;

    tiles.forEach(function(tile, index) {
        var row = Math.floor(index / columns);
        var col = index % columns;
        var backgroundPositionX = (originalBoard[row][col] % columns) * tileSize * -1;
        var backgroundPositionY = Math.floor(originalBoard[row][col] / columns) * tileSize * -1;

        tile.style.background = 'url(' + selectedBackground + ') ' + backgroundPositionX + 'px ' + backgroundPositionY + 'px no-repeat';
        tile.style.backgroundSize = columns * tileSize + 'px ' + rows * tileSize + 'px';
    });
}

function updateTileBackgrounds() {
    var tileSize = 50;
    var tiles = document.querySelectorAll('.tile img');

    tiles.forEach(function(tile, index) {
        var row = Math.floor(index / columns);
        var col = index % columns;
        tile.src = 'background2.png';
        tile.style.objectFit = 'none';
        tile.style.objectPosition = (col * tileSize * -1) + 'px ' + (row * tileSize * -1) + 'px';
        tile.style.width = (columns * tileSize) + 'px';
        tile.style.height = (rows * tileSize) + 'px';
    });
}

// Add this function to your JavaScript
// Modify the shuffleTiles function
// Modify the shuffleTiles function
function shuffleTiles() {
    arrayForBoard = shuffleBoard(originalBoard);
    showTable();
    setTileBackground(); // Add this line to set the background images after shuffling
    moves = 0;
    textMoves.innerHTML = moves;
}

function updateTileBackgrounds() {
    var tileSize = 50;
    var tiles = document.querySelectorAll('.tile img');

    tiles.forEach(function(tile, index) {
        var row = Math.floor(index / columns);
        var col = index % columns;
        tile.src = 'background2.png';
        tile.style.objectFit = 'none';
        tile.style.objectPosition = (col * tileSize * -1) + 'px ' + (row * tileSize * -1) + 'px';
        tile.style.width = (columns * tileSize) + 'px';
        tile.style.height = (rows * tileSize) + 'px';
    });
}
// Add this function to your existing JavaScript code
function cheat() {
    // Display the solution
    arrayForBoard = originalBoard;
    showTable();
    setTileBackground(); // Use the same logic as setTileBackground to maintain images
    moves = 0;
    textMoves.innerHTML = moves;
}

function showWinNotification() {
    var winNotification = document.getElementById("win-notification");
    winNotification.style.display = "block";
}

window.addEventListener("load", start, false);