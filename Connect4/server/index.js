const cors = require('cors')

const express = require('express')
const app = express()
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}))
app.use(express.json()) // to support JSON-encoded bodies
const fs = require('fs')
const path = require('path')
// const { response } = require('express')
const repPath = path.resolve(__dirname, '..') + '/'
app.use(express.static(repPath))

app.get('/connect4', function (req, res) {
    res.sendFile(path.join(repPath, 'index.html'))
})

app.get('/connect4/scores', function (req, res) {
    const data = fs.readFileSync('scores.json', 'utf8')
    const scores = JSON.parse(data)
    res.json(scores)
})

app.post('/connect4/scores', function (req, res) {
    // const scoresObj = req.body
    // scores.red = scoresObj.red
    // scores.yellow = scoresObj.yellow
    // console.log(req.body)
    const data = fs.readFileSync('scores.json', 'utf8')
    const scores = JSON.parse(data)
    const newScores = { ...scores, ...req.body }
    console.log(newScores)
    fs.writeFile('scores.json', JSON.stringify(newScores), function (err) {
        if (err) {
            console.log('Error:', err)
        }
    })
})

app.listen(3001)
