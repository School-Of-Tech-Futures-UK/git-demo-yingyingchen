for (let rowIndex = 0; rowIndex < 7; rowIndex++) {
    for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
        if (rowIndex % 2 === 0) {
            if (columnIndex % 2 === 0) {
                document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add('color-change-red-yellow')
            } else {
                document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add('color-change-yellow-red')
            }
        } else {
            if (columnIndex % 2 === 0) {
                document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add('color-change-yellow-red')
            } else {
                document.getElementById(`row-${rowIndex}-column-${columnIndex}`).classList.add('color-change-red-yellow')
            }
        }


    }
}