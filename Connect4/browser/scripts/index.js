const rowIndexArr = Array.from(Array(7).keys()).map(x => `${x}`)
const columnIndexArr = Array.from(Array(6).keys()).map(x => `${x}`)
const combinations = rowIndexArr.flatMap(d => columnIndexArr.map(v => d + v))

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(combinations)

for (let i in combinations) {
    if (i % 2 === 0) {
        document.getElementById('row-' + combinations[i][0] + '-column-' + combinations[i][1]).classList.add('color-change-red-yellow')
    } else {
        document.getElementById('row-' + combinations[i][0] + '-column-' + combinations[i][1]).classList.add('color-change-yellow-red')
    }
}