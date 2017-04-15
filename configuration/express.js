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
   db: sequelize
});

app.use(session({
  genid: function(req) {
    return uuid().replace(/-/g, '')
  },
  store: sessionStore,
  secret: 'whota lotta love',
  name: 'session',
  resave: true,
  saveUninitialized: false,
  cookie: {
     expires: 60000,
     maxAge: 60000 * 12
  }
}))

// sessionStore.sync();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

consign()
  .include('controllers')
  .include('routes')
  .into(app);

app.post('/login',
  passport.authenticate('local', { successRedirect: '/'})
);

module.exports = app;
