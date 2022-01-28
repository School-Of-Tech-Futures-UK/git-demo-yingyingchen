const { State, copyStateInstance, takeTurn, checkWinner, checkWinnerInArray } = require('./utils.js')

describe('When calling the copyStateInstance function', () => {
    let state
    beforeEach(() => {
        state = new State(7, 6, 'red')
    })
    it('should return the same state', () => {
        const stateCopy = copyStateInstance(state)
        expect(stateCopy).toStrictEqual(state)
    })
    it('the original state will not change when the copied state has been changed', () => {
        const stateCopy = copyStateInstance(state)
        stateCopy.turn = 'yellow'
        stateCopy.board[1][0] = 'red'
        stateCopy.winnerRecord.player = 'A253'
        stateCopy.nameColorMap.red = 'A253'


        expect(state.turn).toBe('red')
        expect(state.board[1][0]).toBe(null)
        expect(state.winnerRecord.player).toBe('')
        expect(state.nameColorMap.red).toBe('')
    })
})


describe('When calling the takeTurn function', () => {
    let state
    beforeEach(() => {
        state = new State(7, 6, 'red')
    })
    it('should return a correct new state', () => {
        const rowSelected = 1
        const output = takeTurn(rowSelected, state)
        state.turn = 'yellow'
        state.board[1][0] = 'red'
        state.numberOfTurns++
        expect(output.board).toStrictEqual(state.board)
    })

    it('should return the same state when the selected row is full', () => {
        const rowSelected = 1
        state.board[rowSelected] = ['red', 'yellow', 'red', 'yellow', 'red', 'yellow']
        state.numberOfTurns = 6
        state.turn = 'red'

        const output = takeTurn(rowSelected, state)
        expect(output).toStrictEqual(state)
    })
})

describe('When calling the checkWinnerInArray function', () => {
    const scenarios = []
    scenarios.push([['yellow', 'yellow', 'yellow', 'red', 'red', 'red'], null])
    let arr
    for (let arrLength = 4; arrLength < 8; arrLength++) {
        arr = Array(arrLength)
        for (let i = 0; i < arrLength - 3; i++) {
            arr.fill(0)
            arr.fill('red', i, i + 4)
            scenarios.push([arr.slice(), 'red'])
            arr.fill('yellow', i, i + 4)
            scenarios.push([arr.slice(), 'yellow'])
        }
    }

    it.each(scenarios)("when the input is '%s', it should return '%s'", (input, expectedOutput) => {
        expect(checkWinnerInArray(input)).toStrictEqual(expectedOutput)
    })
})



// board = [
//   [ null, null, null, null, null, null ],
//   [ null, null, null, null, null, null ],
//   [ null, null, null, null, null, null ],
//   [ null, null, null, null, null, null ],
//   [ null, null, null, null, null, null ],
//   [ null, null, null, null, null, null ],
//   [ null, null, null, null, null, null ]
// ]


let board
let boards
let outputs

describe('When calling the checkWinner function', () => {
    beforeEach(() => {
        boards = []
    })

    it(`should return null if there are no consecutive discs`, () => {
        board = Array(7).fill(null).map(() => Array(6).fill(null))
        board[0][0] = 1
        expect(checkWinner(board)).toBe(null)
    })

    it(`should return 'red' when the red player successfully place four consecutive discs in a row`, () => {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 6 - 3; j++) {
                board = Array(7).fill(null).map(() => Array(6).fill(null))
                board[i].fill('red', j, j + 4)
                boards.push(board.map(x => x.slice()))
            }
        }
        outputs = boards.map(x => checkWinner(x))
        outputs.forEach(o => expect(o).toBe('red'))
    })

    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a row`, () => {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 6 - 3; j++) {
                board = Array(7).fill(null).map(() => Array(6).fill(null))
                board[i].fill('yellow', j, j + 4)
                boards.push(board.map(x => x.slice()))
            }
        }
        outputs = boards.map(x => checkWinner(x))
        outputs.forEach(o => expect(o).toBe('yellow'))
    })

    it(`should return 'red' when the red player successfully place four consecutive discs in a column`, () => {
        for (let j = 0; j < 6; j++) {
            for (let i = 0; i < 7 - 3; i++) {
                board = Array(7).fill(null).map(() => Array(6).fill(null))
                board[i][j] = 'red'
                board[i + 1][j] = 'red'
                board[i + 2][j] = 'red'
                board[i + 3][j] = 'red'
                boards.push(board.map(x => x.slice()))
            }
        }
        outputs = boards.map(x => checkWinner(x))
        outputs.forEach(o => expect(o).toBe('red'))
    })

    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a column`, () => {
        for (let j = 0; j < 6; j++) {
            for (let i = 0; i < 7 - 3; i++) {
                board = Array(7).fill(null).map(() => Array(6).fill(null))
                board[i][j] = 'yellow'
                board[i + 1][j] = 'yellow'
                board[i + 2][j] = 'yellow'
                board[i + 3][j] = 'yellow'
                boards.push(board.map(x => x.slice()))
            }
        }
        outputs = boards.map(x => checkWinner(x))
        outputs.forEach(o => expect(o).toBe('yellow'))
    })

    const rowNum = 7
    const colNum = 6
    const maxLength = Math.max(rowNum, colNum)
    it(`should return 'red' when the red player successfully place four consecutive discs in a diagonal`, () => {
        // top left to bottom
        for (let k = 3; k <= 2 * (maxLength - 1) - 4; k++) {
            for (let y = rowNum - 1; y >= 0; y--) {
                const x = k - y
                if (x >= 0 && x < colNum) {
                    board = Array(7).fill(null).map(() => Array(6).fill(0))
                    board[y][x] = 'red'
                    let filled = 1
                    if (y - 1 >= 0 && x + 1 < colNum) {
                        board[y - 1][x + 1] = 'red'
                        filled++
                    }
                    if (y - 2 >= 0 && x + 2 < colNum) {
                        board[y - 2][x + 2] = 'red'
                        filled++
                    }
                    if (y - 3 >= 0 && x + 3 < colNum) {
                        board[y - 3][x + 3] = 'red'
                        filled++
                    }
                    if (filled === 4) {
                        boards.push(board.map(x => x.slice()))
                    }
                }
            }
        }
        // bottom to top left
        for (let k = 4; k <= 2 * (maxLength - 1) - 3; k++) {
            for (let y = rowNum - 1; y >= 0; y--) {
                const x = k - (rowNum - y)
                if (x >= 0 && x < colNum) {
                    board = Array(7).fill(null).map(() => Array(6).fill(0))
                    board[y][x] = 'red'
                    let filled = 1
                    if (y - 1 >= 0 && x - 1 >= 0) {
                        board[y - 1][x - 1] = 'red'
                        filled++
                    }
                    if (y - 2 >= 0 && x - 2 >= 0) {
                        board[y - 2][x - 2] = 'red'
                        filled++
                    }
                    if (y - 3 >= 0 && x - 3 >= 0) {
                        board[y - 3][x - 3] = 'red'
                        filled++
                    }
                    if (filled === 4) {
                        boards.push(board.map(x => x.slice()))
                    }
                }
            }
        }
        outputs = boards.map(x => checkWinner(x))
        outputs.forEach(o => expect(o).toBe('red'))
    })

    it(`should return 'yellow' when the yellow player successfully place four consecutive discs in a diagonal`, () => {
        // top left to bottom
        for (let k = 3; k <= 2 * (maxLength - 1) - 4; k++) {
            for (let y = rowNum - 1; y >= 0; y--) {
                const x = k - y
                if (x >= 0 && x < colNum) {
                    board = Array(7).fill(null).map(() => Array(6).fill(0))
                    board[y][x] = 'yellow'
                    let filled = 1
                    if (y - 1 >= 0 && x + 1 < colNum) {
                        board[y - 1][x + 1] = 'yellow'
                        filled++
                    }
                    if (y - 2 >= 0 && x + 2 < colNum) {
                        board[y - 2][x + 2] = 'yellow'
                        filled++
                    }
                    if (y - 3 >= 0 && x + 3 < colNum) {
                        board[y - 3][x + 3] = 'yellow'
                        filled++
                    }
                    if (filled === 4) {
                        boards.push(board.map(x => x.slice()))
                    }
                }
            }
        }
        // bottom to top left
        for (let k = 4; k <= 2 * (maxLength - 1) - 3; k++) {
            for (let y = rowNum - 1; y >= 0; y--) {
                const x = k - (rowNum - y)
                if (x >= 0 && x < colNum) {
                    board = Array(7).fill(null).map(() => Array(6).fill(0))
                    board[y][x] = 'yellow'
                    let filled = 1
                    if (y - 1 >= 0 && x - 1 >= 0) {
                        board[y - 1][x - 1] = 'yellow'
                        filled++
                    }
                    if (y - 2 >= 0 && x - 2 >= 0) {
                        board[y - 2][x - 2] = 'yellow'
                        filled++
                    }
                    if (y - 3 >= 0 && x - 3 >= 0) {
                        board[y - 3][x - 3] = 'yellow'
                        filled++
                    }
                    if (filled === 4) {
                        boards.push(board.map(x => x.slice()))
                    }
                }
            }
        }
        outputs = boards.map(x => checkWinner(x))
        outputs.forEach(o => expect(o).toBe('yellow'))
    })

    it(`should return 'nobody' when the there are no consecutive discs of either red or yellow and the board is full`, () => {
        board = Array(7).fill(null).map(() => Array(6).fill(null))
        board.forEach((row, i, Arr) => {
            if (i !== 3) {
                Arr[i].forEach((el, id, arr) => {
                    if(id % 2 === 0) {
                        arr[id] = 'red'
                    } else {
                        arr[id] = 'yellow'
                    }
                })
            } else {
                Arr[i].forEach((el, id, arr) => {
                    if(id % 2 === 0) {
                        arr[id] = 'yellow'
                    } else {
                        arr[id] = 'red'
                    }
                })
            }
            
        })
        let output = checkWinner(board)
        expect(output).toBe('nobody')
    })
})
















