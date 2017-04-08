var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./database');

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

module.exports = passport;
