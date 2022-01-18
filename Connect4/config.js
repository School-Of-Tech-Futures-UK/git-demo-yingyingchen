const rowNum = 7
const colNum = 6
const boardInit = []; const _boardInit = []

const map = {
  red: 1,
  yellow: -1
}

// create board,  _board
function createState () {
  const board = []; const _board = []
  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    const colArr = []; const _colArr = []
    for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
      colArr.push(null)
      _colArr.push(0)
    }
    board.push([...colArr])
    _board.push([..._colArr])
  }
  return {
    turn: 'red',
    numberOfTurns: 0,
    board: [...board],
    _board: [..._board]
  }
}

// initialize state object
let state = createState()
