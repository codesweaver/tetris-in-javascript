// TETRIS

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
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
        [7, 7, 7, 7],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
];
const currentPiece = {
    col : getCenterPosX(PIECES[1].length),
    row: 0,
    piece: PIECES[1]
};

const canvas = document.getElementById("mainCanvas");
const context = canvas.getContext("2d");
const board = Array(ROWS).fill().map(() => Array(COLS).fill(0));

init();
bindKeyboardEvent();
draw();

// functions //

function init() {
    canvas.width = COLS * BLOCK_SIZE;
    canvas.height = ROWS * BLOCK_SIZE;
}

function bindKeyboardEvent() {
    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft":
                currentPiece.col--;
                break;
            case "ArrowRight":
                currentPiece.col++;
                break;
            case "ArrowDown":
                currentPiece.row++;
                break;
            default: return;
        }

        e.preventDefault();
        draw();
    });
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
        for (let col = 0; col < shape[0].length; col++) {
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
