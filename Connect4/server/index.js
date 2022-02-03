const cors = require('cors')
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const repPath = path.resolve(__dirname, '..') + '/browser'
const bodyParser = require('body-parser')

app.use(cors())
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.static(repPath))
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}))

app.get('/connect4/home', function (req, res) {
    res.sendFile(path.join(repPath, 'home.html'))
})

app.get('/connect4/solo', function (req, res) {
    res.sendFile(path.join(repPath, 'aiplayer.html'))
})
app.get('/connect4/with-friend', function (req, res) {
    res.sendFile(path.join(repPath, 'index.html'))
})

app.get('/connect4/scores', function (req, res) {
    const data = fs.readFileSync('scores.json', 'utf8')
    const scores = JSON.parse(data)
    res.json(scores)
})

app.post('/connect4/scores', function (req, res) {
    const data = fs.readFileSync('scores.json', 'utf8')
    const scores = JSON.parse(data)
    const body = req.body
    let newScores = {}
    if (!body.clearScoreBoard) {
        newScores = { ...scores, ...body.data }
    }
    console.log(newScores)
    fs.writeFile('scores.json', JSON.stringify(newScores), function (err) {
        if (err) {
            console.log('Error:', err)
        }
    })
})

app.listen(3001)
