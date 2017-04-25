var express = require('express');
var session = require('express-session')
var passport = require('./passport');
var bodyParser = require('body-parser')
var uuid = require('uuid/v4');
var sequelize = require('./database').sequelize;
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var consign = require('consign');
var app = express();

var sessionStore = new SequelizeStore({
   db: sequelize,
   checkExpirationInterval: 15 * 60 * 1000,
   expiration: 24 * 60 * 60 * 1000
});

app.use(session({
  genid: function(req) {
    return uuid().replace(/-/g, '')
  },
  store: sessionStore,
  secret: 'whota lotta love',
  name: 'session',
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  next();
});

app.all('*',
  function(req, res, next) {
    if (!req.isAuthenticated() & req.url != '/login')
      res.redirect(401, 'http://localhost:8080/login.html');
    else
      next();
})

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.sendStatus(200);
  }
);

app.get('/session-check',
  function(req, res) {
    if (req.isAuthenticated()) {
      res.sendStatus(200)
      }
    else
      res.sendStatus(401)
  }
);

consign()
  .include('controllers')
  .include('routes')
  .into(app);

module.exports = app;
