const rowNum = 7
const colNum = 6
const board = []; const _board = []

let i, j
let turn = 'red'

const map = {
  red: 1,
  yellow: -1
}

// create board
for (i = 0; i < rowNum; i++) {
  const colArr = []
  for (j = 0; j < colNum; j++) {
    colArr.push(null)
  }
  board.push(colArr.map(x => x))
}

// _board
for (i = 0; i < rowNum; i++) {
  const _colArr = []
  for (j = 0; j < colNum; j++) {
    _colArr.push(0)
  }
  _board.push(_colArr.map(x => x))
}

function getAvailableColumn (rowSelected) {
  for (let j = colNum - 1; j >= 0; j--) {
    if (board[rowSelected][j] === null) {
      return j
    }
  }
  return 'full'
}

// play the game and change the game state
function takeTurn (rowSelected) {
  const columnSelected = getAvailableColumn(rowSelected)
  if (columnSelected !== 'full') {
    if (board[rowSelected][columnSelected] === null) {
      board[rowSelected][columnSelected] = turn
      _board[rowSelected][columnSelected] = map[turn]
      if (turn === 'red') {
        turn = 'yellow'
      } else if (turn === 'yellow') {
        turn = 'red'
      }
    }
  }
  console.log(`row selected: ${rowSelected} column selected: ${columnSelected}`)
  console.log(_board)
}

// clear the board
function clearBoard () {
  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
      document.getElementById(`row-${rowIndex}-column-${columnIndex}`).innerHTML = ''
    }
  }
}

// draw the board at a given state
function drawBoard (board) {
  clearBoard()
  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
      if (!board[rowIndex][columnIndex]) {
        continue
      }
      const color = board[rowIndex][columnIndex]
      document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add('fall')
      document.getElementById(`row-${rowIndex}-column-${columnIndex}`).style.background = color
    }
  }
}

// reset game
function resetGame () {
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      _board[i][j] = 0
      board[i][j] = null
    }
  }
  turn = 'red'
  document.querySelectorAll('.column').forEach((cube) => {
    cube.style.background = 'white'
    cube.classList.remove('fall')
  })
  document.getElementById('player-indicator').style.background = 'red'
  const winnerName = document.getElementById('winner-name')
  winnerName.innerText = ''
  const winnerDisplay = document.getElementById('winner-display')
  winnerDisplay.style.display = 'None'
  console.log('resetGame was called')
  console.log(board)
}

// check for winner
function checkWinnerInArray (arr) {
  for (j = 0; j < arr.length - 3; j++) {
    const sum = arr.slice(j, j + 4).reduce((prev, curr) => prev + curr, 0)
    if (sum === 4) {
      turn = null
      return 'red'
    } else if (sum === -4) {
      turn = null
      return 'yellow'
    }
  }
}

function checkWinner () {
  let i, j, winner
  // check row
  for (i = 0; i < rowNum; i++) {
    const rowChecking = _board[i]
    winner = checkWinnerInArray(rowChecking)
    if (winner) {
      return winner
    }
  }

  // check col
  for (j = 0; j < colNum; j++) {
    const columnChecking = []
    for (i = 0; i < rowNum; i++) {
      columnChecking.push(_board[i][j])
    }
    winner = checkWinnerInArray(columnChecking)
    if (winner) {
      return winner
    }
  }

  // check top left to bottom right
  const maxLength = Math.max(rowNum, colNum)
  let diagChecking
  for (let k = 0; k <= 2 * (maxLength - 1); k++) {
    diagChecking = []
    for (let y = rowNum - 1; y >= 0; y--) {
      const x = k - y
      if (x >= 0 && x < colNum) {
        diagChecking.push(_board[y][x])
      }
    }
    if (diagChecking.length > 3) {
      winner = checkWinnerInArray(diagChecking)
      if (winner) {
        return winner
      }
    }
  }

  // check bottom left to top right
  for (let k = 0; k <= 2 * (maxLength - 1); k++) {
    diagChecking = []
    for (let y = rowNum - 1; y >= 0; y--) {
      const x = k - (rowNum - y)
      if (x >= 0 && x < colNum) {
        diagChecking.push(_board[y][x])
      }
    }
    if (diagChecking.length > 3) {
      winner = checkWinnerInArray(diagChecking)
      if (winner) {
        return winner
      }
    }
  }

  // check if game is finished
  let gameFinish = true
  for (i = 0; i < rowNum; i++) {
    for (j = 0; j < colNum; j++) {
      if (_board[i][j] === 0) {
        gameFinish = false
      }
    }
  }
  if (gameFinish === true) {
    return 'nobody'
  }

  console.log('checkWinner was called')
  return null
}

// click the column, play the game, record the game state, and check for winner
function positionClick (ev) {
  const id = ev.target.id
  const rowSelected = id[4]
  takeTurn(rowSelected)
  document.getElementById('player-indicator').style.background = turn || 'red'
  drawBoard(board)
  const winner = checkWinner()
  if (winner) {
    if (typeof winner !== 'string' || !['red', 'yellow', 'nobody'].includes(winner)) {
      const newLocal = "Expecting 'checkWinner' to return null or one of the strings 'red', 'yellow' or 'nobody'. Actually received: " + winner
      throw newLocal
    }
    const winnerName = document.getElementById('winner-name')
    winnerName.innerText = winner
    const winnerDisplay = document.getElementById('winner-display')
    winnerDisplay.style.display = 'block'
  }
}
