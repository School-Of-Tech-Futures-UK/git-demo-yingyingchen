import { rowNum, createState, takeTurn, drawBoard, checkWinner, getPlayerNames, displayScoreBoard, refreshPage } from './utils.js'

// initialize state object
let state = createState()

const thisTurnRecord = {
    player: '',
    color: '',
    score: 0
}

const playersMap = {
    red: '',
    yellow: ''
}

// click the column, play the game, record the game state, and check for winner
function positionClick (ev) {
    const id = ev.target.id
    const rowSelected = id[4]
    state = takeTurn(rowSelected, state)
    document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
    document.getElementById('player-indicator-name').innerText = playersMap[state.turn] ? playersMap[state.turn] : playersMap.red
    drawBoard(state)
    const winner = checkWinner(state)
    if (winner === 'red' || winner === 'yellow') {
        state.winner = winner
        thisTurnRecord.player = playersMap[state.winner]
        thisTurnRecord.color = state.winner
        thisTurnRecord.score = 42 - state.numberOfTurns
        const idByTimeStamp = new Date().getTime()
        const record = {}
        record[idByTimeStamp] = { ...thisTurnRecord }
        // post the new score record to server
        fetch('http://localhost:3001/connect4/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
        // display the winner information
        const winnerName = document.getElementById('winner-name')
        winnerName.innerText = thisTurnRecord.player
        const winnerColor = document.getElementById('winner-color')
        winnerColor.innerText = thisTurnRecord.color
        const winnerScore = document.getElementById('winner-score')
        winnerScore.innerText = 42 - thisTurnRecord.score
        document.getElementById('winnerMessageButton').click()
        for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
            const gridPosition = document.getElementById(`row-${rowIndex}`)
            gridPosition.removeEventListener('click', positionClick)
            console.log(`remove positionClick to row-${rowIndex}`)
        }
    } else if (winner === 'nobody') {
        document.getElementById('nobodyWinsButton').click()
    }
}

// reset game
function resetGame () {
    state = createState()
    document.querySelectorAll('.column').forEach((grid) => {
        grid.style.background = 'white'
        grid.classList.remove('fall')
    })
    document.getElementById('player-indicator').style.background = 'red'
    const winnerName = document.getElementById('winner-name')
    winnerName.innerText = ''
    // Bind the click events for the grid.
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
        const gridPosition = document.getElementById(`row-${rowIndex}`)
        gridPosition.addEventListener('click', positionClick)
        console.log(`added positionClick to row-${rowIndex}`)
    }
    document.getElementById('tbody').innerHTML = ''
    const classList = document.getElementById('playAgainButtonOutside').classList
    classList.remove('d-block')
    classList.add('d-none')
    console.log('resetGame was called')
}

// Bind the click events for the grid.
for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    const gridPosition = document.getElementById(`row-${rowIndex}`)
    gridPosition.addEventListener('click', positionClick)
    console.log(`added positionClick to row-${rowIndex}`)
}

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
userNameInputButton.addEventListener('click', () => { getPlayerNames(playersMap) })
