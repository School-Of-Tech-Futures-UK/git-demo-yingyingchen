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


describe('When calling createState function', () => {
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

describe('When calling isColumnAvailable function', () => {
    //  arrange
    const pieces = ['red', 'yellow', 'red', 'yellow', 'red', 'yellow']

    const board = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
    ]

    const rowSelected = 1
    for (let i in pieces) {
        //  act
        const output = isColumnAvailable(rowSelected, board)
        const expectedOutput = true
        board[rowSelected].push(pieces[i])
        board[rowSelected].shift()
        //  assert
        test(`should return true as the column has ${6 - i + 1} places available`, () => {
            expect(output).toBe(expectedOutput)
        })
    }

    test(`should return false as the column is full`, () => {
        const output = isColumnAvailable(rowSelected, board)
        const expectedOutput = false
        expect(output).toBe(expectedOutput)
    })
})

describe('When calling takeTurn function', () => {
    //  arrange
    // const pieces = ['red', 'yellow']//, 'red', 'yellow', 'red', 'yellow']
    // const expectedTurns = ['yellow', 'red']//, 'yellow', 'red', 'yellow', 'red']
    const rowSelected = 1
    const rowNum = 7
    const colNum = 6
    const initialPlayer = 'red'
    const state = createState(rowNum, colNum, initialPlayer)
    const scenarios = []
    for (let i = 0; i < 2; i++) {
        const input = {
            rowSelected: rowSelected,
            state: { ...state }
        }
        state.board[rowSelected][i] = state.turn
        state._board[rowSelected][i] = (state.turn === 'red') ? 1 : -1
        state.numberOfTurns++
        state.turn = (state.turn === 'red') ? 'yellow' : 'red'
        const expectedOutput = {
            turn: state.turn,
            numberOfTurns: state.numberOfTurns,
            board: [...state.board],
            _board: [...state._board]
        }
        scenarios.push([input, expectedOutput])
        
    }

    // act & assert
    it.each(scenarios) ('the turn should alter', (input, expectedOutput) => {
        expect(takeTurn(input.rowSelected, input.state)).toStrictEqual(expectedOutput)
    })

})