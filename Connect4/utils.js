// get the lowest available column
function getAvailableColumn (rowSelected) {
  for (let j = colNum - 1; j >= 0; j--) {
    if (state.board[rowSelected][j] === null) {
      return j
    }
  }
  return 'full'
}

// play the game and change the game state
function takeTurn (rowSelected) {
  const columnSelected = getAvailableColumn(rowSelected)
  const stateCopy = { ...state }
  if (columnSelected !== 'full') {
    if (stateCopy.board[rowSelected][columnSelected] === null) {
      stateCopy.board[rowSelected][columnSelected] = stateCopy.turn
      stateCopy._board[rowSelected][columnSelected] = map[stateCopy.turn]
      stateCopy.turn = (stateCopy.turn === 'yellow') ? 'red' : 'yellow'
      stateCopy.numberOfTurns++
    }
  }
  return stateCopy
}

// clear the board
function clearBoard () {
  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
      document.getElementById(`row-${rowIndex}-column-${columnIndex}`).style.background = 'white'
    }
  }
}

// draw the board at a given state
function drawBoard () {
  clearBoard()
  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
      if (!state.board[rowIndex][columnIndex]) {
        continue
      }
      const color = state.board[rowIndex][columnIndex]
      document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add('fall')
      document.getElementById(`row-${rowIndex}-column-${columnIndex}`).style.background = color
    }
  }
}

// check for winner
function checkWinnerInArray (arr) {
  for (j = 0; j < arr.length - 3; j++) {
    const sum = arr.slice(j, j + 4).reduce((prev, curr) => prev + curr, 0)
    if (sum === 4) {
      return 'red'
    } else if (sum === -4) {
      return 'yellow'
    }
  }
  return null
}

function checkWinner () {
  let winner = null
  // check row
  for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    const rowChecking = state._board[rowIndex]
    winner = checkWinnerInArray(rowChecking)
    if (winner) {
      return winner
    }
  }

  // check col
  for (let columnIndex = 0; columnIndex < colNum; columnIndex++) {
    const columnChecking = []
    for (let rowIndex = 0; rowIndex < rowNum; rowIndex++) {
      columnChecking.push(state._board[rowIndex][columnIndex])
    }
    winner = checkWinnerInArray(columnChecking)
    if (winner) {
      return winner
    }
  }

  // check top left to bottom right
  const maxLength = Math.max(rowNum, colNum)
  for (let k = 0; k <= 2 * (maxLength - 1); k++) {
    const diagChecking = []
    for (let y = rowNum - 1; y >= 0; y--) {
      const x = k - y
      if (x >= 0 && x < colNum) {
        diagChecking.push(state._board[y][x])
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
    const diagChecking = []
    for (let y = rowNum - 1; y >= 0; y--) {
      const x = k - (rowNum - y)
      if (x >= 0 && x < colNum) {
        diagChecking.push(state._board[y][x])
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
  for (rowIndex = 0; rowIndex < rowNum; rowIndex++) {
    for (columnIndex = 0; columnIndex < colNum; columnIndex++) {
      if (state._board[rowIndex][columnIndex] === 0) {
        gameFinish = false
      }
    }
  }
  if (gameFinish === true) {
    return 'nobody'
  }
  // console.log("checkWinner was called");
  return null
}
