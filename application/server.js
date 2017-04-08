var app = require('../configuration/express');
var db = require('../configuration/database');

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.listen(8080, function () {
  db.sequelize.sync();

  console.log('Example app listening on port 8080!');
})
