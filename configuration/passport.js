var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./database');

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({where: {email: username}}).then(function (foundedUser) {
      if (!foundedUser) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        if (foundedUser.isValidPassword(password)) {
          return done(null, foundedUser);
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
    db.User.findById(id).then(function (foundedUser) {
        done(null, foundedUser);
    });
});

module.exports = passport;
