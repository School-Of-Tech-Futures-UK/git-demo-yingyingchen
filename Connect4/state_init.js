const rowNum = 7
const colNum = 6
const board = [], _board = []

let i, j

const map = {
    red: 1,
    yellow: -1
}

// create board
for (i = 0; i < rowNum; i++) {
    const colArr = []
    for (j = 0; j < colNum; j++) {
        colArr.push(null)
    }
    board.push(colArr.map(x => x))
}

//_board
for (i = 0; i < rowNum; i++) {
    const _colArr = []
    for (j = 0; j < colNum; j++) {
        _colArr.push(0)
    }
    _board.push(_colArr.map(x => x))
}

function getAvailableColumn(rowSelected) {
    for (let j = colNum - 1; j >= 0; j--) {
        if (board[rowSelected][j] === null) {
            return j
        }
    }
    return "full"
}

const state = {
    turn: "red",
    board: [...board],
    _board: [..._board]
}

// if (typeof exports === 'object') {
//     console.log("Running in Node")
//     // Node. Does not work with strict CommonJS, but only CommonJS-like 
//     // environments that support module.exports, like Node.
//     module.exports = {
//         getAvailableColumn,
//         state,
//         map
//     }
// } else {
//     console.log("Running in Browser")
// }