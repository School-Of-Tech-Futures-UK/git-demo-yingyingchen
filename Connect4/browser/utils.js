// create state class
class State {
    constructor(rowNum, colNum, initialPlayerColor) {
        this.rowNum = rowNum
        this.colNum = colNum
        this.initialPlayerColor = initialPlayerColor
        this.board = []
        this.turn = ''
        this.numberOfTurns = 0
        this.winnerRecord = {
            player: '',
            color: '',
            score: 0
        }

        this.nameColorMap = {
            red: '',
            yellow: ''
        }
        this.createState(rowNum, colNum, initialPlayerColor)
    }

    createState(rowNum, colNum, initialPlayerColor) {
        this.board = Array(rowNum).fill(null).map(() => Array(colNum).fill(null))
        this.turn = initialPlayerColor
    }

    setNameColorMap(redPlayerName, yellowPlayerName) {
        this.nameColorMap.red = redPlayerName
        this.nameColorMap.yellow = yellowPlayerName
    }

    setWinnerRecord(winnerColor) {
        this.winnerRecord.color = winnerColor
        this.winnerRecord.player = this.nameColorMap[winnerColor]
        this.winnerRecord.score = 42 - this.numberOfTurns
    }

    isRowAvailable(rowSelected) {
        return this.board[rowSelected].includes(null)
    }
}

function copyStateInstance(state) {
    let stateCopy = new State(state.rowNum, state.colNum, state.initialPlayerColor)
    stateCopy.board = state.board.map(x => x.slice())
    stateCopy.turn = state.turn
    stateCopy.numberOfTurns = state.numberOfTurns
    stateCopy.winnerRecord = { ...state.winnerRecord }
    stateCopy.nameColorMap = { ...state.nameColorMap }
    return stateCopy
}

function takeTurn(rowSelected, state) {
    const stateCopy = copyStateInstance(state)
    if (state.isRowAvailable(rowSelected)) {
        // push one piece into the board
        const nullArr = stateCopy.board[rowSelected].filter(x => !x)
        const newArr = stateCopy.board[rowSelected].filter(x => x)
        newArr.push(stateCopy.turn)
        stateCopy.board[rowSelected] = [...newArr, ...nullArr.slice(0, nullArr.length - 1)]
        // change turn 
        stateCopy.turn = (stateCopy.turn === 'yellow') ? 'red' : 'yellow'
        // increase number of turns played
        stateCopy.numberOfTurns++
        // return new state
    }
    return stateCopy
}



// check for winner
function checkWinnerInArray(arr) {
    for (let j = 0; j < arr.length - 3; j++) {
        if (arr.slice(j, j + 4).every(x => x === 'red')) {
            return 'red'
        } else if (arr.slice(j, j + 4).every(x => x === 'yellow')) {
            return 'yellow'
        }
    }
    return null
}

function checkWinner(board) {
    const rowNum = board.length
    const colNum = board[0].length
    let winner = null
    // check row
    let winnerCheckingArr = board.map((row) => checkWinnerInArray(row))
    if (winnerCheckingArr.includes('red')) {
        return 'red'
    } else if (winnerCheckingArr.includes('yellow')) {
        return 'yellow'
    }

    // check col
    for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
        const columnChecking = []
        for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
            columnChecking.push(board[rowIndex][columnIndex])
        }
        winner = checkWinnerInArray(columnChecking)
        if (winner) {
            return winner
        }
    }

    // check top left to bottom right
    const maxLength = Math.max(rowNum, colNum)
    for (let k = 0; k <= 2 * (maxLength - 1); k++) {
        const diagChecking = []
        for (let y = rowNum - 1; y >= 0; y--) {
            const x = k - y
            if (x >= 0 && x < colNum) {
                diagChecking.push(board[y][x])
            }
        }
        if (diagChecking.length > 3) {
            winner = checkWinnerInArray(diagChecking)
            if (winner) {
                return winner
            }
        }
    }

    // check bottom left to top right
    for (let k = 0; k <= 2 * (maxLength - 1); k++) {
        const diagChecking = []
        for (let y = rowNum - 1; y >= 0; y--) {
            const x = k - (rowNum - y)
            if (x >= 0 && x < colNum) {
                diagChecking.push(board[y][x])
            }
        }
        if (diagChecking.length > 3) {
            winner = checkWinnerInArray(diagChecking)
            if (winner) {
                return winner
            }
        }
    }

    // check if game is finished
    if (!board.some(x => x.includes(null))) { return 'nobody' }
    return null
}

if (typeof exports === 'object') {
    module.exports = {
        State,
        copyStateInstance,
        takeTurn,
        checkWinnerInArray,
        checkWinner,
    }
}