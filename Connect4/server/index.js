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

const data = fs.readFileSync('scores.json', 'utf8')
const scores = JSON.parse(data)

app.get('/connect4', function (req, res) {
    res.sendFile(path.join(repPath, 'index.html'))
})

app.get('/connect4/scores', function (req, res) {
    res.json(scores)
})

app.post('/connect4/scores', function (req, res) {
    const scoresObj = req.body
    scores.red = scoresObj.red
    scores.yellow = scoresObj.yellow
    fs.writeFile('scores.json', JSON.stringify(scores), function (err) {
        if (err) {
            console.log('Error:', err)
        }
    })
})

app.listen(3001)
