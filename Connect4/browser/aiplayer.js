function getRandomRow(state) {
    const allRows = [...Array(state.rowNum).keys()]
    const availableRows = allRows.filter(i => state.isRowAvailable(i))
    return availableRows[Math.floor(Math.random() * (availableRows.length - 1))]
}

if (typeof exports === 'object') {
    module.exports = {
        getRandomRow
    }
}