var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./configuration/database');
var bodyParser = require('body-parser')

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
    db.User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: false })
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
