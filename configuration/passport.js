var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./database');

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({where: {email: username}}).then(function (foundUser) {
      if (!foundUser) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        if (foundUser.isValidPassword(password)) {
          return done(null, foundUser);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      }
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    db.User.findById(id).then(function (foundUser) {
        done(null, foundUser);
    });
});

module.exports = passport;
