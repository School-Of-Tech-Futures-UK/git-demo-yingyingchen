// create state class
class State {
    constructor(rowNum, colNum, initialPlayerColor) {
        this.rowNum = rowNum
        this.colNum = colNum
        this.board = []
        this._board = []
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
        this.createState(initialPlayerColor)
    }

    createState(initialPlayerColor) {
        for (let rowIndex = 0; rowIndex < this.rowNum; rowIndex++) {
            const colArr = []; const _colArr = []
            for (let columnIndex = 0; columnIndex < this.colNum; columnIndex++) {
                colArr.push(null)
                _colArr.push(0)
            }
            this.board.push([...colArr])
            this._board.push([..._colArr])
        }
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
}

function isColumnAvailable(rowSelected, board) {
    return board[rowSelected].includes(null)
}

function takeTurn(rowSelected, state) {
    const map = {
        red: 1,
        yellow: -1
    }
    if (isColumnAvailable(rowSelected, state.board)) {
        const stateCopy = state
        const nullArr = stateCopy.board[rowSelected].filter(x => !x)
        const newArr = stateCopy.board[rowSelected].filter(x => x)
        newArr.push(stateCopy.turn)
        const zeroArr = stateCopy._board[rowSelected].filter(x => x === 0)
        const newArrMap = stateCopy._board[rowSelected].filter(x => x !== 0)
        newArrMap.push(map[stateCopy.turn])
        stateCopy.board[rowSelected] = [...newArr, ...nullArr.slice(0, nullArr.length - 1)]
        stateCopy._board[rowSelected] = [...newArrMap, ...zeroArr.slice(0, zeroArr.length - 1)]
        stateCopy.turn = (stateCopy.turn === 'yellow') ? 'red' : 'yellow'
        stateCopy.numberOfTurns++
        return stateCopy
    }
    return state
}

// clear the board
function clearBoard() {
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).style.background = 'white'
        }
    }
}

// draw the board at a given state
function drawBoard(state) {
    clearBoard()
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
            if (!state.board[rowIndex][columnIndex]) {
                continue
            }
            const color = state.board[rowIndex][columnIndex]
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add('fall')
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).style.background = color
        }
    }
}

// check for winner
function checkWinnerInArray(arr) {
    for (let j = 0; j < arr.length - 3; j++) {
        const sum = arr.slice(j, j + 4).reduce((prev, curr) => prev + curr, 0) // hof
        if (sum === 4) {
            return 'red'
        } else if (sum === -4) {
            return 'yellow'
        }
    }
    return null
}

function checkWinner(state) {
    let winner = null
    // check row
    for (let rowIndex = 0; rowIndex < state.rowNum; rowIndex++) {
        const rowChecking = state._board[rowIndex]
        winner = checkWinnerInArray(rowChecking)
        if (winner) {
            return winner
        }
    }

    // check col
    for (let columnIndex = 0; columnIndex < state.colNum; columnIndex++) {
        const columnChecking = []
        for (let rowIndex = 0; rowIndex < state.rowNum; rowIndex++) {
            columnChecking.push(state._board[rowIndex][columnIndex])
        }
        winner = checkWinnerInArray(columnChecking)
        if (winner) {
            return winner
        }
    }

    // check top left to bottom right
    const maxLength = Math.max(state.rowNum, state.colNum)
    for (let k = 0; k <= 2 * (maxLength - 1); k++) {
        const diagChecking = []
        for (let y = state.rowNum - 1; y >= 0; y--) {
            const x = k - y
            if (x >= 0 && x < state.colNum) {
                diagChecking.push(state._board[y][x])
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
        for (let y = state.rowNum - 1; y >= 0; y--) {
            const x = k - (state.rowNum - y)
            if (x >= 0 && x < state.colNum) {
                diagChecking.push(state._board[y][x])
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
    if (state.numberOfTurns === 42) { return 'nobody' }
    console.log('checkWinner was called')
    return null
}

// get player names
function getPlayerNames(playersMap) {
    const redName = document.getElementById('red-name')
    const yellowName = document.getElementById('yellow-name')
    if (redName.value && yellowName.value) {
        playersMap.red = redName.value
        playersMap.yellow = yellowName.value
        document.getElementById('player-indicator-name').innerText = playersMap.red
        const userNameInputButton = document.getElementById('userNameInputButton')
        userNameInputButton.setAttribute('data-dismiss', 'modal')
        console.log('Player names are successfully submitted.')
    } else {
        redName.placeholder = 'Please enter the name of the red player'
        yellowName.placeholder = 'Please enter the name of the yellow player'
    }
}

// get scores data
function displayScoreBoard() {
    fetch('http://localhost:3001/connect4/scores')
        .then(resp => resp.json())
        .then(data => {
            const highestTen = Object.values(data).sort((a, b) => b.score - a.score).slice(0, 10)
            const tbody = document.getElementById('tbody')

            for (let i = 0; i < highestTen.length; i++) {
                let tr = '<tr>'
                /* Must not forget the $ sign */
                tr += '<td>' + highestTen[i].player + '</td>' + '<td>' + highestTen[i].color + '<td>' + highestTen[i].score.toString() + '</td></tr>'

                /* We add the table row to the table body */
                tbody.innerHTML += tr
            }
        })
}

// clear the score board
function clearScoreBoard() {
    // post the empty score record to server
    fetch('http://localhost:3001/connect4/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: {}, clearScoreBoard: true })
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
}

// reload the page
function refreshPage() {
    location.reload()
}

if (typeof exports === 'object') {
    module.exports = {
        State,
        isColumnAvailable,
        takeTurn,
        drawBoard,
        checkWinner,
        getPlayerNames,
        displayScoreBoard,
        refreshPage,
        clearScoreBoard
    }
}