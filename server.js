var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/maria', function (req, res) {
  res.send('Hello World Maria!')
})

app.listen(8080, function () {
  var db = require('./configuration/database');

  db.sequelize.sync();

  console.log('Example app listening on port 8080!')
})
