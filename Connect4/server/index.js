const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}))
app.use(express.json()) // to support JSON-encoded bodies
const fs = require('fs')
const { response } = require('express')
const repPath = require('path').resolve(__dirname, '..') + '/'
app.use(express.static(repPath))

app.get('/connect4', function (req, res) {
  res.sendFile(repPath + 'index.html')
})

app.listen(3000)
