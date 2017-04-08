var app = require('../configuration/express');
var passport = require('../configuration/passport');
var db = require('../configuration/database');

var auth = function(req, res, next){
    if (!req.isAuthenticated() & req.url != '/login')
        res.sendStatus(401);
    else
        next();
};

app.use(auth);

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'
                                 })
);

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.get('/maria', function (req, res) {
  res.send('Hello World Maria!');
})

app.listen(8080, function () {
  db.sequelize.sync();

  console.log('Example app listening on port 8080!');
})
