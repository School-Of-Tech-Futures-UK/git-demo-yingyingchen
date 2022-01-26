const { State, takeTurn, checkWinner, checkWinnerInArray } = require('./utils.js')

let state

beforeEach(() => {
    state = new State(7, 6, 'red')
})

describe('When calling the takeTurn function', () => {
    it('should return a correct new state', () => {
        const rowSelected = 1
        const output = takeTurn(rowSelected, state)
        state.turn = 'yellow'
        state.board[1][5] = 'red'
        state._board[1][5] = 1
        state.numberOfTurns++
        expect(output).toStrictEqual(state)
    })

    it('should return the same state when the selected row is full', () => {
        const rowSelected = 1
        state.board[rowSelected] = ['red', 'yellow', 'red', 'yellow', 'red', 'yellow']
        state._board[rowSelected] = [1, -1, 1, -1, 1, -1]
        state.numberOfTurns = 6
        state.turn = 'red'

        const output = takeTurn(rowSelected, state)
        expect(output).toStrictEqual(state)
    })
})

describe('When calling the checkWinnerInArray function', () => {
    const scenarios = []
    scenarios.push([[-1, -1, -1, 1, 1, 1], null])
    scenarios.push([[-1, -1, 1, 1, 1, 1, -1], 'red'])
    scenarios.push([[-1, -1, -1, -1, 0, 0, 0], 'yellow'])

    it.each(scenarios)("when the input is '%s', it should return '%s'", (input, expectedOutput) => {
        expect(checkWinnerInArray(input)).toStrictEqual(expectedOutput)
    })
})

describe('When calling the checkWinner function', () => {

    it(`should return null if there are no consecutive discs and the board is not full`, () => {
        state = takeTurn(1, state)
        expect(checkWinner(state)).toBe(null)
    })


    it(`should return 'red' when the red player successfully place four consecutive discs in a row`, () => {
        for (let i = 0; i < 3; i++) {
            state = takeTurn(1, state)
            state = takeTurn(2, state)
        }
        state = takeTurn(1, state)
        let output = checkWinner(state)
        expect(output).toBe('red')
    })

    it(`should return 'red' when the red player successfully place four consecutive discs in a column`, () => {
        for (let i = 0; i < 3; i++) {
            state = takeTurn(i, state)
            state = takeTurn(i, state)
        }
        state = takeTurn(3, state)
        let output = checkWinner(state)
        expect(output).toBe('red')
    })

    it(`should return 'red' when the red player successfully place four consecutive discs in a diagonal`, () => {
        state = takeTurn(0, state)
        state = takeTurn(1, state)
        state = takeTurn(1, state)
        state = takeTurn(2, state)
        state = takeTurn(2, state)
        state = takeTurn(3, state)
        state = takeTurn(2, state)
        state = takeTurn(3, state)
        state = takeTurn(3, state)
        state = takeTurn(0, state)
        state = takeTurn(3, state)
        let output = checkWinner(state)
        expect(output).toBe('red')
    })

    it(`should return 'red' when the red player successfully place four consecutive discs in a counter-diagonal`, () => {
        state = takeTurn(6, state)
        state = takeTurn(5, state)
        state = takeTurn(5, state)
        state = takeTurn(4, state)
        state = takeTurn(3, state)
        state = takeTurn(4, state)
        state = takeTurn(4, state)
        state = takeTurn(3, state)
        state = takeTurn(2, state)
        state = takeTurn(3, state)
        state = takeTurn(3, state)
        let output = checkWinner(state)
        expect(output).toBe('red')
    })

    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a row`, () => {
        state = takeTurn(0, state)
        for (let i = 0; i < 3; i++) {
            state = takeTurn(1, state)
            state = takeTurn(2, state)
        }
        state = takeTurn(1, state)
        let output = checkWinner(state)
        expect(output).toBe('yellow')
    })


    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a column`, () => {
        state = takeTurn(4, state)
        for (let i = 0; i < 3; i++) {
            state = takeTurn(i, state)
            state = takeTurn(i, state)
        }
        state = takeTurn(3, state)
        let output = checkWinner(state)
        expect(output).toBe('yellow')
    })

    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a diagonal`, () => {
        state = takeTurn(6, state)
        state = takeTurn(0, state)
        state = takeTurn(1, state)
        state = takeTurn(1, state)
        state = takeTurn(2, state)
        state = takeTurn(2, state)
        state = takeTurn(3, state)
        state = takeTurn(2, state)
        state = takeTurn(3, state)
        state = takeTurn(3, state)
        state = takeTurn(0, state)
        state = takeTurn(3, state)
        let output = checkWinner(state)
        expect(output).toBe('yellow')
    })


    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a counter-diagonal`, () => {
        state = takeTurn(0, state)
        state = takeTurn(6, state)
        state = takeTurn(5, state)
        state = takeTurn(5, state)
        state = takeTurn(4, state)
        state = takeTurn(3, state)
        state = takeTurn(4, state)
        state = takeTurn(4, state)
        state = takeTurn(3, state)
        state = takeTurn(2, state)
        state = takeTurn(3, state)
        state = takeTurn(3, state)
        let output = checkWinner(state)
        expect(output).toBe('yellow')
    })

    it(`should return 'nobody' when the there are no consecutive discs of either red or yellow and the board is full`, () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 6; j++){
                state = takeTurn(i, state)
            }
        }
        state = takeTurn(6, state)
        state = takeTurn(3, state)
        for (let i = 3; i < 7; i++) {
            for (let j = 0; j < 6; j++){
                state = takeTurn(i, state)
            }
        }
        let output = checkWinner(state)
        expect(output).toBe('nobody')
    })

})