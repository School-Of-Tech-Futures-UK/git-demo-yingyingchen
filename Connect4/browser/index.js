const rowNum = 7
const colNum = 6
const initialPlayerColor = 'red'
const PLAYER = 'red'
const AI = 'yellow'
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

// click the column, play the game, record the game state, and check for winner
function positionClick(event) {
    const id = event.target.id
    let rowSelected = id[4]
    if (state.turn === PLAYER) {
        // update game state after placing a disc
        state = takeTurn(rowSelected, state)
        // change player indicator
        document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
        document.getElementById('player-indicator-name').innerText = state.nameColorMap[state.turn] ? state.nameColorMap[state.turn] : state.nameColorMap.red
        // draw the grid with the given state
        drawBoard(state)
        // check for winner
        const winnerColor = checkWinner(state.board)
        if (winnerColor === 'red') {
            gameOver(winnerColor)
        } else {
            setTimeout(() => {
                const rowSelectedByAI = getRandomRow(state)
                state = takeTurn(rowSelectedByAI, state)
                // change player indicator
                document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
                document.getElementById('player-indicator-name').innerText = state.nameColorMap[state.turn] ? state.nameColorMap[state.turn] : state.nameColorMap.red
                // draw the grid with the given state
                drawBoard(state)
                // check for winner
                const winnerColor = checkWinner(state.board)
                if (winnerColor === 'yellow') {
                    gameOver(winnerColor)
                }
            }, 500)

        }
    }





}

function gameOver(winnerColor) {
    if (winnerColor === 'red' || winnerColor === 'yellow') {
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
        document.querySelectorAll('.row').forEach(i => i.removeEventListener('click', positionClick))
    } else if (winnerColor === 'nobody') {
        document.getElementById('nobodyWinsButton').click()
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

// get player names
function getPlayerNames() {
    redPlayer = document.getElementById('red-name').value
    yellowPlayer = document.getElementById('yellow-name').value
    if (redPlayer && yellowPlayer) {
        state.setNameColorMap(redPlayer, yellowPlayer)
        document.getElementById('player-indicator-name').innerText = state.nameColorMap.red
        const userNameInputButton = document.getElementById('userNameInputButton')
        userNameInputButton.setAttribute('data-dismiss', 'modal')
        console.log('Player names have been successfully submitted.')
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
                tr += '<td>' + highestTen[i].player + '</td>' + '<td>' + highestTen[i].color + '<td>' + highestTen[i].score.toString() + '</td></tr>'
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
    document.querySelectorAll('.row').forEach(i => i.addEventListener('click', positionClick))

    // Bind reset events for the grid
    document.querySelectorAll('.playAgainButton').forEach(i => i.addEventListener('click', resetGame))

    document.getElementById('reset-button').addEventListener('click', refreshPage)

    document.getElementById('scoreBoardButton').addEventListener('click', displayScoreBoard)
    document.getElementById('scoreBoardButtonNobody').addEventListener('click', displayScoreBoard)
    document.getElementById('scoreBoardCloseButton').addEventListener('click', () => {
        const classList = document.getElementById('playAgainButtonOutside').classList
        classList.remove('d-none')
        classList.add('d-block')
    })

    document.getElementById('userNameInputButton').addEventListener('click', () => { getPlayerNames() })

    document.getElementById('clearScoreBoardButton').addEventListener('click', clearScoreBoard)
}

