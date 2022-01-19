import * as config from './config.js'
import * as utils from './utils.js'

// initialize state object
let state = utils.createState()
const scores = {}
// get scores data
function getScores () {
    fetch('http://localhost:3001/connect4/scores')
        .then(resp => resp.json())
        .then(data => {
            scores.red = data.red
            scores.yellow = data.yellow
            document.getElementById('red-score').innerText = scores.red
            document.getElementById('yellow-score').innerText = scores.yellow
        })
}
getScores()
// click the column, play the game, record the game state, and check for winner
function positionClick (ev) {
    const id = ev.target.id
    const rowSelected = id[4]
    state = utils.takeTurn(rowSelected, state)
    document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
    utils.drawBoard(state)
    const winner = utils.checkWinner(state)
    if (winner) {
        if (typeof winner !== 'string' || !['red', 'yellow', 'nobody'].includes(winner)) {
            // eslint-disable-next-line no-throw-literal
            throw "Expecting 'checkWinner' to return null or one of the strings 'red', 'yellow' or 'nobody'. Actually received: " + winner
        }
        state.winner = winner
        // post the updated score to server
        scores[state.winner] += 42 - state.numberOfTurns
        fetch('http://localhost:3001/connect4/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scores)
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
        // display the winner information
        const winnerName = document.getElementById('winner-name')
        winnerName.innerText = winner
        const winnerScore = document.getElementById('winner-score')
        winnerScore.innerText = 42 - state.numberOfTurns
        const winnerDisplay = document.getElementById('winner-display')
        winnerDisplay.style.display = 'block'
        if (winner === 'red') {
            winnerDisplay.style.background = 'red'
        } else if (winner === 'yellow') {
            winnerDisplay.style.background = 'rgb(255, 217, 0)'
        }

        for (let rowIndex = 0; rowIndex < config.rowNum; rowIndex++) {
            const gridPosition = document.getElementById(`row-${rowIndex}`)
            gridPosition.removeEventListener('click', positionClick)
            console.log(`remove positionClick to row-${rowIndex}`)
        }
        getScores()
    }
}

// reset game
function resetGame () {
    state = utils.createState()
    document.querySelectorAll('.column').forEach((grid) => {
        grid.style.background = 'white'
        grid.classList.remove('fall')
    })
    document.getElementById('player-indicator').style.background = 'red'
    document.getElementById('red-score-circle').style.background = 'red'
    document.getElementById('yellow-score-circle').style.background = 'rgb(255, 217, 0)'
    const winnerName = document.getElementById('winner-name')
    winnerName.innerText = ''
    const winnerDisplay = document.getElementById('winner-display')
    winnerDisplay.style.display = 'None'
    winnerDisplay.style.background = 'blue'
    // Bind the click events for the grid.
    for (let rowIndex = 0; rowIndex < config.rowNum; rowIndex++) {
        const gridPosition = document.getElementById(`row-${rowIndex}`)
        gridPosition.addEventListener('click', positionClick)
        console.log(`added positionClick to row-${rowIndex}`)
    }
    getScores()
    console.log('resetGame was called')
}

// Bind the click events for the grid.
for (let rowIndex = 0; rowIndex < config.rowNum; rowIndex++) {
    const gridPosition = document.getElementById(`row-${rowIndex}`)
    gridPosition.addEventListener('click', positionClick)
    console.log(`added positionClick to row-${rowIndex}`)
}

// Bind reset events for the grid
const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', resetGame)
