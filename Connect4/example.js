const {
    createState,
    isColumnAvailable,
    takeTurn,
    drawBoard,
    checkWinner,
    getPlayerNames,
    displayScoreBoard,
    refreshPage,
    clearScoreBoard
} = require('./utils.js')

const rowSelected = 1
const rowNum = 7
const colNum = 6
const initialPlayer = 'red'
let state = createState(rowNum, colNum, initialPlayer)
const scenarios = []
for (let i = 0; i < 2; i++) {
    const input = {
        rowSelected: rowSelected,
        state: { ...state }
    }
    const expectedOutput = {...state}
    expectedOutput.board[rowSelected][i] = expectedOutput.turn
    expectedOutput._board[rowSelected][i] = (expectedOutput.turn === 'red') ? 1 : -1
    expectedOutput.numberOfTurns++
    expectedOutput.turn = (expectedOutput.turn === 'red') ? 'yellow' : 'red'
    scenarios.push([input, expectedOutput])
    state = expectedOutput
}
console.log(scenarios[0][0].rowSelected, scenarios[0][0].state, scenarios[0][1])

