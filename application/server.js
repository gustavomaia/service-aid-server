var express = require('express');
var app = express();
var db = require('../configuration/database');
var passport = require('../configuration/passport');
var bodyParser = require('body-parser')
var session = require('express-session')
var uuid = require('uuid/v4');

app.use(session({
  genid: function(req) {
    return uuid()
  },
  secret: 'keyboard cat',
  name: 'session',
  resave: true,
  saveUninitialized: false,
  cookie: {
     expires: 60000,
     maxAge: 60000 * 12
  }
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

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
