
let board = Array(7).fill(null).map(() => Array(6).fill(0))
board = Array(7).fill(null).map(() => Array(6).fill(null))
board.forEach((row, i, Arr) => {
    if (i !== 3) {
        Arr[i].forEach((el, id, arr) => {
            if (id % 2 === 0) {
                arr[id] = 'red'
            } else {
                arr[id] = 'yellow'
            }
        })
    } else {
        Arr[i].forEach((el, id, arr) => {
            if (id % 2 === 0) {
                arr[id] = 'yellow'
            } else {
                arr[id] = 'red'
            }
        })
    }

})

console.log(board)