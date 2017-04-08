var express = require('express');
var session = require('express-session')
var passport = require('./passport');
var bodyParser = require('body-parser')
var uuid = require('uuid/v4');

var app = express();

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

app.all('/', function(req, res, next){
    if (!req.isAuthenticated() & req.url != '/login')
        res.sendStatus(401);
    else
        next();
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/'})
);

module.exports = app;
