const rowNum = 7
const colNum = 6
const board = [], _board = []

let i, j
let turn = "red"

const map = {
    red: 1,
    yellow: -1
}

// create board
for (i=0; i<rowNum; i++) {
    const colArr = []
    for (j = 0; j<colNum; j++) {
        colArr.push(null)
    }
    board.push(colArr.map(x => x))
}

//_board
for (i=0; i<rowNum; i++) {
    const _colArr = []
    for (j = 0; j<colNum; j++) {
        _colArr.push(0)
    }
    _board.push(_colArr.map(x => x))
}

function getAvailableColumn(rowSelected) {
    for (let j=colNum-1; j>=0; j--) {
        if (board[rowSelected][j] === null) {
            return j
        }
    }
    return "full"
}

// play the game and change the game state
function takeTurn(rowSelected) {
    const columnSelected = getAvailableColumn(rowSelected)
    if (columnSelected !== "full") {
        if (board[rowSelected][columnSelected] === null) {
            board[rowSelected][columnSelected] = turn
            _board[rowSelected][columnSelected] = map[turn]
            if (turn === 'red') {
                turn = 'yellow'
            } else if (turn === 'yellow') {
                turn = 'red'
            }
        }
    }
    console.log(`row selected: ${rowSelected} column selected: ${columnSelected}`)
    console.log(board)
}

// clear the board
function clearBoard() {
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).innerHTML = ""
        }
    }
}

// draw the board at a given state
function drawBoard(board) {
    clearBoard();
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
            if (!board[rowIndex][columnIndex]) {
                continue;
            }
            const color = board[rowIndex][columnIndex]
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).style.background = color;
        }
    }
}

// click the column, play the game, record the game state, and check for winner
function positionClick(ev) {
    const id = ev.target.id
    const rowSelected = id[4]
    takeTurn(rowSelected)
    drawBoard(board)
}

// reset game
function resetGame() {
    for (let i = 0; i < rowNum; i++) {
        for (let j = 0; j < colNum; j++) {
            _board[i][j] = 0
            board[i][j] = null
        }
    }
    turn = "red"
    document.querySelectorAll(".column").forEach((cube) => cube.style.background = "white")
    console.log("resetGame was called");
    console.log(board)
}
