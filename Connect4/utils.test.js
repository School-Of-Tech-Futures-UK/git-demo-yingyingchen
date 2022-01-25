const {
    createState,
    takeTurn,
    drawBoard,
    checkWinner,
    getPlayerNames,
    displayScoreBoard,
    refreshPage,
    clearScoreBoard
} = require('./utils.js')

describe('When calling createState function',  () => {
    test('should return the initial game state', () => {
        // Arrange
        const rowNum = 7
        const colNum = 6
        const initialPlayer = 'red'

        // Act
        const output = createState(rowNum, colNum, initialPlayer)

        // Assert
        const expectedOutput = {
            turn: 'red',
            numberOfTurns: 0,
            winner: null,
            board: [
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null]
            ],
            _board: [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0]
            ]
        }
        expect(output).toStrictEqual(expectedOutput)
    })
})
