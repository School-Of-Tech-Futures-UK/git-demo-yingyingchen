// const { createState, takeTurn, drawBoard, checkWinner, getPlayerNames, displayScoreBoard, clearScoreBoard, refreshPage } =  require('./utils')
const rowNum = 7
const colNum = 6
const initialPlayerColor = 'red'
let state = new State(rowNum, colNum, initialPlayerColor)

const functions = ['takeTurn', 'checkWinner'];
for (f of functions) {
    const functionObject = window[f];
    if (typeof functionObject !== "function") {
        throw `Looks like expected function '${f}' is missing. Double check the function signatures from academy.js are still present and unaltered.`;
    }
}

// click the column, play the game, record the game state, and check for winner
function positionClick(ev) {
    const id = ev.target.id
    const rowSelected = id[4]
    state = takeTurn(rowSelected, state)
    document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
    document.getElementById('player-indicator-name').innerText = state.nameColorMap[state.turn] ? state.nameColorMap[state.turn] : state.nameColorMap.red
    drawBoard(state)
    const winnerColor = checkWinner(state)
    if (winnerColor === 'red' || winnerColor === 'yellow') {
        // state.winner = winner
        state.setWinnerRecord(winnerColor)
        const idByTimeStamp = new Date().getTime()
        const record = {}
        record[idByTimeStamp] = { ...state.winnerRecord }
        // post the new score record to server
        fetch('http://localhost:3001/connect4/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: record, clearScoreBoard: false })
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
        // display the winner information
        document.getElementById('winner-name').innerText = state.winnerRecord.player
        document.getElementById('winner-color').innerText = state.winnerRecord.color
        document.getElementById('winner-score').innerText = state.numberOfTurns
        document.getElementById('winnerMessageButton').click()
        document.querySelectorAll('.row').forEach(i => i.removeEventListener(
            'click', positionClick))
    } else if (winnerColor === 'nobody') {
        document.getElementById('nobodyWinsButton').click()
    }
}

// clear the board
function clearBoard() {
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
            document.getElementById(`row-${rowIndex}-column-${columnIndex}`).style.background = 'white'
        }
    }
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
    document.querySelectorAll('.column').forEach((grid) => {
        grid.style.background = 'white'
        grid.classList.remove('fall')
    })
    document.getElementById('player-indicator').style.background = 'red'
    const winnerName = document.getElementById('winner-name')
    winnerName.innerText = ''
    // Bind the click events for the grid.
    document.querySelectorAll('.row').forEach(i => i.addEventListener(
        'click', positionClick))
    document.getElementById('tbody').innerHTML = ''
    const classList = document.getElementById('playAgainButtonOutside').classList
    classList.remove('d-block')
    classList.add('d-none')
    console.log('resetGame was called')
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

window.onload = () => {
    // Bind the click events for the grid.
    document.querySelectorAll('.row').forEach(i => i.addEventListener(
        'click', positionClick))

    // Bind reset events for the grid
    document.querySelectorAll('.playAgainButton').forEach(i => i.addEventListener(
        'click', resetGame))

    const resetButton = document.getElementById('reset-button')
    resetButton.addEventListener('click', refreshPage)

    document.getElementById('scoreBoardButton').addEventListener('click', displayScoreBoard)
    document.getElementById('scoreBoardButtonNobody').addEventListener('click', displayScoreBoard)
    document.getElementById('scoreBoardCloseButton').addEventListener('click', () => {
        const classList = document.getElementById('playAgainButtonOutside').classList
        classList.remove('d-none')
        classList.add('d-block')
    })

    const userNameInputButton = document.getElementById('userNameInputButton')
    userNameInputButton.addEventListener('click', () => { getPlayerNames(state.nameColorMap) })

    document.getElementById('clearScoreBoardButton').addEventListener('click', clearScoreBoard)
}

