// append state to json
// function recordState (state) {
//   const fs = require('fs')
//   fs.readFile('state.json', function (err, content) {
//     if (err) throw err
//     const parseJson = JSON.parse(content)
//     parseJson.push(state)
//     fs.writeFile('data.json', JSON.stringify(parseJson), function (err) {
//       if (err) throw err
//     })
//   })
// }

// click the column, play the game, record the game state, and check for winner
function positionClick (ev) {
  const id = ev.target.id
  const rowSelected = id[4]
  state = takeTurn(rowSelected)
  document.getElementById('player-indicator').style.background = state.turn ? state.turn : 'red'
  drawBoard()
  const winner = checkWinner()
  if (winner) {
    if (typeof winner !== 'string' || !['red', 'yellow', 'nobody'].includes(winner)) {
      // eslint-disable-next-line no-throw-literal
      throw "Expecting 'checkWinner' to return null or one of the strings 'red', 'yellow' or 'nobody'. Actually received: " + winner
    }
    const winnerName = document.getElementById('winner-name')
    winnerName.innerText = winner
    const winnerScore = document.getElementById('winner-score')
    winnerScore.innerText = 42 - state.numberOfTurns
    const winnerDisplay = document.getElementById('winner-display')
    winnerDisplay.style.display = 'block'
    winnerDisplay.style.background = winner
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
      const gridPosition = document.getElementById(`row-${rowIndex}`)
      gridPosition.removeEventListener('click', positionClick)
      console.log(`added positionClick to row-${rowIndex}`)
    }
  }
  // recordState(state)
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
  const winnerDisplay = document.getElementById('winner-display')
  winnerDisplay.style.display = 'None'
  winnerDisplay.style.background = 'blue'
  // Bind the click events for the grid.
  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    const gridPosition = document.getElementById(`row-${rowIndex}`)
    gridPosition.addEventListener('click', positionClick)
    console.log(`added positionClick to row-${rowIndex}`)
  }

  console.log('resetGame was called')
}

// Bind the click events for the grid.
for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
  const gridPosition = document.getElementById(`row-${rowIndex}`)
  gridPosition.addEventListener('click', positionClick)
  console.log(`added positionClick to row-${rowIndex}`)
}

// Bind reset events for the grid
const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', resetGame)
