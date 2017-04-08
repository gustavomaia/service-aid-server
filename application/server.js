var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../configuration/database');
var bodyParser = require('body-parser')
var session = require('express-session')
var uuid = require('uuid/v4');

passport.use(new LocalStrategy(

  function(username, password, done) {
    console.log('Usuario recebido: ' + username);
    db.User.findOne({where: {email: username}}).then(function (foundedUser) {
      if (!foundedUser) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      return done(null, foundedUser);
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    db.User.findById(id).then(function (foundedUser) {
        done(null, foundedUser);
    });
});

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
