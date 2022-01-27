const { State, copyStateInstance, takeTurn, checkWinner, checkWinnerInArray } = require('./utils.js')





// describe('When calling the copyStateInstance function', () => {
//     let state
//     beforeEach(() => {
//         state = new State(7, 6, 'red')
//     })
//     it('should return the same state', () => {
//         const stateCopy = copyStateInstance(state)
//         expect(stateCopy).toStrictEqual(state)
//     })
//     it('the original state will not change when the copied state has been changed', () => {
//         const stateCopy = copyStateInstance(state)
//         stateCopy.turn = 'yellow'
//         stateCopy.board[1][0] = 'red'
//         stateCopy._board[1][0] = 1
//         stateCopy.winnerRecord.player = 'A253'
//         stateCopy.nameColorMap.red = 'A253'


//         expect(state.turn).toBe('red')
//         expect(state.board[1][0]).toBe(null)
//         expect(state._board[1][0]).toBe(0)
//         expect(state.winnerRecord.player).toBe('')
//         expect(state.nameColorMap.red).toBe('')
//     })
// })


// describe('When calling the takeTurn function', () => {
//     let state
//     beforeEach(() => {
//         state = new State(7, 6, 'red')
//     })
//     it('should return a correct new state', () => {
//         const rowSelected = 1
//         const output = takeTurn(rowSelected, state)
//         state.turn = 'yellow'
//         state.board[1][0] = 'red'
//         state._board[1][0] = 1
//         state.numberOfTurns++
//         expect(output.board).toStrictEqual(state.board)
//     })

//     it('should return the same state when the selected row is full', () => {
//         const rowSelected = 1
//         state.board[rowSelected] = ['red', 'yellow', 'red', 'yellow', 'red', 'yellow']
//         state._board[rowSelected] = [1, -1, 1, -1, 1, -1]
//         state.numberOfTurns = 6
//         state.turn = 'red'

//         const output = takeTurn(rowSelected, state)
//         expect(output).toStrictEqual(state)
//     })
// })

// describe('When calling the checkWinnerInArray function', () => {
//     const scenarios = []
//     scenarios.push([[-1, -1, -1, 1, 1, 1], null])
//     let arr
//     for (let arrLength = 4; arrLength < 8; arrLength++) {
//         arr = Array(arrLength)
//         for (let i = 0; i < arrLength - 3; i++) {
//             arr.fill(0)
//             arr.fill(1, i, i + 4)
//             scenarios.push([arr.slice(), 'red'])
//             arr.fill(-1, i, i + 4)
//             scenarios.push([arr.slice(), 'yellow'])
//         }
//     }

//     it.each(scenarios)("when the input is '%s', it should return '%s'", (input, expectedOutput) => {
//         expect(checkWinnerInArray(input)).toStrictEqual(expectedOutput)
//     })
// })

describe('When calling the checkWinner function and the board is not full', () => {
    it(`should return null if there are no consecutive discs`, () => {
        board = Array(7).fill(null).map(() => Array(6).fill(0))
        board[0][0] = 1
        expect(checkWinner(board)).toBe(null)
    })

    it(`should return 'red' when the red player successfully place four consecutive discs in a row`, () => {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; i < 6 - 3; i++) {
                board = Array(7).fill(null).map(() => Array(6).fill(0))
                board[i].fill(1, j, j + 4)
                let output = checkWinner(board)
                expect(output).toBe('red')
            }
        }
    })

    let scenarios = []
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 6 - 3; j++) {
            board = Array(7).fill(null).map(() => Array(6).fill(0))
            board[i].fill(-1, j, j + 4)
            scenarios.push([board.map(x => x.slice()), 'yellow'])
        }
    }

    it.each(scenarios)(`should return 'yellow' when the yellow player successfully place four consecutive discs in a row`, (input, expectedOutput) => {
        let output = checkWinner(input)
        expect(output).toBe(expectedOutput)
    })
})

describe('When calling the checkWinner function', () => {
    let boards = []
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 6 - 3; j++) {
            board = Array(7).fill(null).map(() => Array(6).fill(0))
            board[i].fill(-1, j, j + 4)
            boards.push(board.map(x => x.slice()))
        }
    }

    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a row`, () => {
        let outputs = boards.map(x => checkWinner(x))
        outputs.forEach(o => expect(o).toBe('yellow'))
    })
})



// it(`should return 'red' when the red player successfully place four consecutive discs in a column`, () => {
//     for (let i = 0; i < 3; i++) {
//         state = takeTurn(i, state)
//         state = takeTurn(i, state)
//     }
//     state = takeTurn(3, state)
//     let output = checkWinner(state)
//     expect(output).toBe('red')
// })

// it(`should return 'red' when the red player successfully place four consecutive discs in a diagonal`, () => {
//     state = takeTurn(0, state)
//     state = takeTurn(1, state)
//     state = takeTurn(1, state)
//     state = takeTurn(2, state)
//     state = takeTurn(2, state)
//     state = takeTurn(3, state)
//     state = takeTurn(2, state)
//     state = takeTurn(3, state)
//     state = takeTurn(3, state)
//     state = takeTurn(0, state)
//     state = takeTurn(3, state)
//     let output = checkWinner(state)
//     expect(output).toBe('red')
// })

// it(`should return 'red' when the red player successfully place four consecutive discs in a counter-diagonal`, () => {
//     state = takeTurn(6, state)
//     state = takeTurn(5, state)
//     state = takeTurn(5, state)
//     state = takeTurn(4, state)
//     state = takeTurn(3, state)
//     state = takeTurn(4, state)
//     state = takeTurn(4, state)
//     state = takeTurn(3, state)
//     state = takeTurn(2, state)
//     state = takeTurn(3, state)
//     state = takeTurn(3, state)
//     let output = checkWinner(state)
//     expect(output).toBe('red')
// })

// it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a row`, () => {
//     state = takeTurn(0, state)
//     for (let i = 0; i < 3; i++) {
//         state = takeTurn(1, state)
//         state = takeTurn(2, state)
//     }
//     state = takeTurn(1, state)
//     let output = checkWinner(state)
//     expect(output).toBe('yellow')
// })


// it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a column`, () => {
//     state = takeTurn(4, state)
//     for (let i = 0; i < 3; i++) {
//         state = takeTurn(i, state)
//         state = takeTurn(i, state)
//     }
//     state = takeTurn(3, state)
//     let output = checkWinner(state)
//     expect(output).toBe('yellow')
// })

// it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a diagonal`, () => {
//     state = takeTurn(6, state)
//     state = takeTurn(0, state)
//     state = takeTurn(1, state)
//     state = takeTurn(1, state)
//     state = takeTurn(2, state)
//     state = takeTurn(2, state)
//     state = takeTurn(3, state)
//     state = takeTurn(2, state)
//     state = takeTurn(3, state)
//     state = takeTurn(3, state)
//     state = takeTurn(0, state)
//     state = takeTurn(3, state)
//     let output = checkWinner(state)
//     expect(output).toBe('yellow')
// })


// it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a counter-diagonal`, () => {
//     state = takeTurn(0, state)
//     state = takeTurn(6, state)
//     state = takeTurn(5, state)
//     state = takeTurn(5, state)
//     state = takeTurn(4, state)
//     state = takeTurn(3, state)
//     state = takeTurn(4, state)
//     state = takeTurn(4, state)
//     state = takeTurn(3, state)
//     state = takeTurn(2, state)
//     state = takeTurn(3, state)
//     state = takeTurn(3, state)
//     let output = checkWinner(state)
//     expect(output).toBe('yellow')
// })

// it(`should return 'nobody' when the there are no consecutive discs of either red or yellow and the board is full`, () => {
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 6; j++) {
//             state = takeTurn(i, state)
//         }
//     }
//     state = takeTurn(6, state)
//     state = takeTurn(3, state)
//     for (let i = 3; i < 7; i++) {
//         for (let j = 0; j < 6; j++) {
//             state = takeTurn(i, state)
//         }
//     }
//     let output = checkWinner(state)
//     expect(output).toBe('nobody')
// })
