const rowNum = 7
const colNum = 6
const initialPlayerColor = 'red'
let PLAYER = 'red'
let AI = 'yellow'
let MINMAXPROBABILITY = 0
let state = new State(rowNum, colNum, initialPlayerColor)
let redPlayer = null
let yellowPlayer = null
const functions = ['takeTurn', 'checkWinner'];
for (f of functions) {
    const functionObject = window[f];
    if (typeof functionObject !== "function") {
        throw `Looks like expected function '${f}' is missing. Double check the function signatures from academy.js are still present and unaltered.`;
    }
}

function getAvailableRows(board) {
    const allRows = [...Array(rowNum).keys()]
    return allRows.filter(i => board[i].includes(null))
}

function getRandomRow(board) {
    const availableRows = getAvailableRows(board)
    return availableRows[Math.floor(Math.random() * (availableRows.length - 1))]
}

function getArrayScore(arr, player) {
    let score = 0
    let adversary = AI
    if (player === AI) {
        adversary = PLAYER
    }

    for (let j = 0; j < arr.length - 3; j++) {
        let arrSlice = arr.slice(j, j + 4)
        const win = arrSlice.every(x => x === player)
        const almostWin = arrSlice.filter(x => x === player).length === 3 && arrSlice.filter(x => !x).length === 1
        const twoStepsToWin = arrSlice.filter(x => x === player).length === 2 && arrSlice.filter(x => !x).length === 2
        const adversaryAlmostWin = arrSlice.filter(x => x === adversary).length === 3 && arrSlice.filter(x => !x).length === 1
        if (win) {
            score += 100
        }
        if (almostWin) {
            score += 5
                // console.log('+5')
        }
        if (twoStepsToWin) {
            score += 2
                // console.log('+2')
        }
        if (adversaryAlmostWin) {
            score -= 4
                // console.log('-4')
        }
    }

    return score
}

function getScore(board, player) {
    let score = 0
        // center column
    score += board[Math.floor(rowNum / 2)].filter(x => x === player).length * 3

    // row
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        const rowChecking = board[rowIndex]
        score += getArrayScore(rowChecking, player)
    }

    // column
    for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
        const columnChecking = []
        for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
            columnChecking.push(board[rowIndex][columnIndex])
        }
        score += getArrayScore(columnChecking, player)
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
            score += getArrayScore(diagChecking, player)
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
            score += getArrayScore(diagChecking, player)
        }
    }
    return score
}

function getMinMaxRow(board, depth, alpha, beta, isMaxPlayer) {
    const availableRows = getAvailableRows(board)
    const isTerminal = (checkWinner(board) || availableRows.length === 0)
    if (depth === 0 || isTerminal) {
        if (isTerminal) {
            let winner = checkWinner(board)

            if (winner === PLAYER) {
                return [null, -Math.pow(10, 14)]
            } else if (winner === AI) {
                return [null, Math.pow(10, 14)]
            } else {
                return [null, 0]
            }
        } else {
            return [null, getScore(board, AI)]
        }
    }

    if (isMaxPlayer) {
        let score = -Math.pow(10, 1000)
        let bestRow = availableRows[Math.floor(Math.random() * (availableRows.length - 1))]
        for (let rowIndex of availableRows) {
            const boardCopy = board.map(x => x.slice())
            const nextBoard = placeDisc(rowIndex, boardCopy, AI)
            const nextScore = getMinMaxRow(nextBoard, depth - 1, alpha, beta, false)[1]
            if (nextScore > score) {
                score = nextScore
                bestRow = rowIndex

            }
            alpha = Math.max(alpha, score)
            if (alpha > beta) {
                break
            }
        }
        return [bestRow, score]
    } else {
        let score = Math.pow(10, 1000)
        let bestRow = availableRows[Math.floor(Math.random() * (availableRows.length - 1))]
        for (let rowIndex of availableRows) {
            const boardCopy = board.map(x => x.slice())
            const nextBoard = placeDisc(rowIndex, boardCopy, PLAYER)
            const nextScore = getMinMaxRow(nextBoard, depth - 1, alpha, beta, true)[1]
            if (nextScore < score) {
                score = nextScore
                bestRow = rowIndex
            }
            beta = Math.min(beta, score)
            if (alpha >= beta) {
                break
            }
        }
        return [bestRow, score]
    }
}

function setDifficulty(event) {
    MINMAXPROBABILITY = Number(event.target.value)
}

function chooseWithProbability(rowSelectedByAI, randomRow) {
    const r = Math.random()
    return r <= MINMAXPROBABILITY ? rowSelectedByAI : randomRow
}

function suggestMove() {
    console.log(`suggest move called`)
    if (state.turn === PLAYER) {
        AI = 'red'
        PLAYER = 'yellow'
        const [rowSelectedByAI, score] = getMinMaxRow(state.board, 5, -Math.pow(10, 1000), Math.pow(10, 1000), true)
        console.log(`suggest move: ${rowSelectedByAI}`)
        AI = 'yellow'
        PLAYER = 'red'
        document.getElementById(`row-${rowSelectedByAI}`).style.background = 'red'
        setTimeout(() => document.getElementById(`row-${rowSelectedByAI}`).style.background = 'darkblue', 200)
    }
}

// click the column, play the game, record the game state, and check for winner
function positionClick(event) {
    const id = event.target.id
    let rowSelected = id[4]
    if (state.isRowAvailable(rowSelected)) {
        document.getElementById('button-player').play()
            // update game state after placing a disc
        state = takeTurn(rowSelected, state)
            // change player indicator
        document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
        document.getElementById('player-indicator-name').innerText = state.nameColorMap[state.turn] ? state.nameColorMap[state.turn] : state.nameColorMap.red
            // draw the grid with the given state
        drawBoard(state)
            // check for winner
        const winnerColor = checkWinner(state.board)
        if (winnerColor) {
            gameOver(winnerColor)
        } else {
            setTimeout(() => {
                // const rowSelectedByAI = getRandomRow(state)
                const [rowSelectedByAI, score] = getMinMaxRow(state.board, 5, -Math.pow(10, 1000), Math.pow(10, 1000), true)
                const randomRow = getRandomRow(state.board)
                rowSelected = chooseWithProbability(rowSelectedByAI, randomRow)
                state = takeTurn(rowSelected, state)
                console.log(`row by ai: ${rowSelectedByAI} row by random: ${randomRow} row: ${rowSelected} ${MINMAXPROBABILITY}`)
                    // change player indicator
                document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
                document.getElementById('player-indicator-name').innerText = state.nameColorMap[state.turn] ? state.nameColorMap[state.turn] : state.nameColorMap.red
                    // draw the grid with the given state
                drawBoard(state)
                    // check for winner
                const winnerColor = checkWinner(state.board)
                if (winnerColor === AI) {
                    gameOver(winnerColor)
                }
            }, 0.01)

        }
    }
}

function gameOver(winnerColor) {
    if (winnerColor === 'red' || winnerColor === 'yellow') {
        state.setWinnerRecord(winnerColor)
        const idByTimeStamp = new Date().getTime()
        const record = {}
        record[idByTimeStamp] = {...state.winnerRecord }
            // display the winner information
        document.getElementById('winner-color').innerText = state.winnerRecord.color
        document.getElementById('winner-score').innerText = state.numberOfTurns
        document.getElementById('winnerMessageButton').click()
        document.querySelectorAll('.row').forEach(i => i.removeEventListener('click', positionClick))
    } else if (winnerColor === 'nobody') {
        document.getElementById('nobodyWinsButton').click()
    }

    if (winnerColor === PLAYER) {
        document.getElementById('win-player').play()
    } else if (winnerColor === AI) {
        document.getElementById('lose-player').play()
    }
}

// clear the board
function clearBoard() {
    document.querySelectorAll('.column:not(#player-indicator)').forEach(i => i.style.background = 'white')
    return 'board has been cleared'
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

// reset game
function resetGame() {
    state = new State(rowNum, colNum, initialPlayerColor)
    state.setNameColorMap(redPlayer, yellowPlayer)
    document.querySelectorAll('.column:not(#player-indicator)').forEach((grid) => {
        grid.style.background = 'white'
        grid.classList.remove('fall')
    })
    document.getElementById('player-indicator').style.background = 'red'
    document.getElementById('winner-name').innerText = ''
        // Bind the click events for the grid.
    document.querySelectorAll('.row').forEach(i => i.addEventListener('click', positionClick))
    document.getElementById('tbody').innerHTML = ''
    const classList = document.getElementById('playAgainButtonOutside').classList
    classList.remove('d-block')
    classList.add('d-none')
    console.log('resetGame was called')
}

// reload the page
function refreshPage() {
    location.reload()
}

window.onload = () => {
    // Bind the click events for the grid.
    document.querySelectorAll('.row').forEach(i => i.addEventListener('click', positionClick))

    document.querySelectorAll('.chooseDifficultyButton').forEach(i => i.addEventListener('click', setDifficulty))

    // Bind reset events for the grid

    document.getElementById('reset-button').addEventListener('click', refreshPage)
    document.getElementById('suggest-move-button').addEventListener('click', suggestMove)
}