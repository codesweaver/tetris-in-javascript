// TETRIS

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const DROP_INTERVAL = 1000;
const COLORS = [
    null, // 빈 칸
    "#25edc7",
    "#ff9517",
    "#9268ff",
    "#0062f3",
    "#59ff5b",
    "#fbdc00",
    "#ff0015",
];
const PIECES = [
    null, // 빈 칸
    [ // T
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    [ // J
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
    ],
    [ // L
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
    ],
    [ // O
        [4, 4],
        [4, 4],
    ],
    [ // S
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
    ],
    [ // Z
        [6, 6, 0],
        [0, 6, 6],
        [0, 0, 0],
    ],
    [ // I
        [0, 0, 0, 0],
        [7, 7, 7, 7],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
];

const canvas = document.getElementById("mainCanvas");
const context = canvas.getContext("2d");
const board = Array(ROWS).fill().map(() => Array(COLS).fill(0));

let currentPiece = createPiece(getRandomPieceType());
let prevTimestamp = null;
let passedTime = 0;

init();
bindKeyboardEvent();
draw();
requestAnimationFrame(gameLoop);

// functions //
function init() {
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
}

function tryMoveDown() {
    if (isValidPosition(currentPiece.piece, currentPiece.row+1, currentPiece.col)) {
        currentPiece.row++;
        return true;
    }
    return false;
}

function gameLoop(timestamp) {
    if (prevTimestamp !== null) {
        passedTime += (timestamp - prevTimestamp);
    }
    prevTimestamp = timestamp;

    if (passedTime >= DROP_INTERVAL) {
        passedTime = 0;

        if (!tryMoveDown()) {
            lockPiece();
            currentPiece = createPiece(getRandomPieceType());
        }

        draw();
    }
    requestAnimationFrame(gameLoop);
}

function lockPiece() {
    const piece = currentPiece.piece;
    for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
            if (piece[row][col]) {
                board[currentPiece.row + row][currentPiece.col + col] = piece[row][col];
            }
        }
    }
}

function calculateStartRow(shape) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                return -row;
            }
        }
    }

    return 0;
}

function getRandomPieceType() {
    return Math.floor(Math.random() * PIECES.length-1) + 1;
}

function createPiece(type) {
    return {
        col : getCenterPosX(PIECES[type].length),
        row: calculateStartRow(PIECES[type]),
        piece: PIECES[type]
    };
}

function bindKeyboardEvent() {

    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft": {
                if (isValidPosition(currentPiece.piece, currentPiece.row, currentPiece.col-1)) {
                    currentPiece.col--;
                }
                break;
            }
            case "ArrowRight": {
                if (isValidPosition(currentPiece.piece, currentPiece.row, currentPiece.col+1)) {
                    currentPiece.col++;
                }
                break;
            }
            case "ArrowDown": {
                tryMoveDown();
                break;
            }
            case "ArrowUp": {
                const rotatedShape = rotateClockwise90(currentPiece.piece);
                if (isValidPosition(rotatedShape, currentPiece.row, currentPiece.col)) {
                    currentPiece.piece = rotatedShape;
                }
                break;
            }
            default: {
                return;
            }
        }

        e.preventDefault();
        draw();
    });
}

function isValidPosition(shape, targetRow, targetCol) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            const boardRow = row + targetRow;
            const boardCol = col + targetCol;
            const cell = shape[row][col];

            if (cell) {
                if (isOutsideBoard(boardRow, boardCol) || hasCollision(boardRow, boardCol)) {
                    return false;
                }
            }
        }
    }

    return true;
}

function isOutsideBoard(boardRow, boardCol) {
    return boardCol < 0 || boardCol >= COLS || boardRow < 0 || boardRow >= ROWS;
}

function hasCollision(boardRow, boardCol) {
    return board[boardRow][boardCol];
}

function rotateClockwise90(shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows));

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            rotated[col][rows - 1 - row] = shape[row][col];
        }
    }

    return rotated;
}

function draw() {
    clearCanvas();
    drawBoard();
    drawPiece();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBoard() {
    context.strokeStyle = "#444";

    for (let row = 0; row<ROWS; row++) {
        for (let col = 0; col<COLS; col++) {
            const cell = board[row][col];
            if (cell) {
                context.fillStyle = COLORS[cell];
                context.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
            context.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

function drawPiece() {
    context.strokeStyle = "#666";

    const shape = currentPiece.piece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            const cell = shape[row][col];
            if (cell) {
                context.fillStyle = COLORS[cell];
                const posY = (currentPiece.row + row) * BLOCK_SIZE;
                const posX = (currentPiece.col + col) * BLOCK_SIZE;
                context.fillRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeRect(posX, posY, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function getCenterPosX(length) {
    return Math.floor((COLS - length) / 2);
}
