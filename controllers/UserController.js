var db = require('../configuration/database');

module.exports = function(app) {
  let UserController = {
    get: function(req, res) {
      let loggedUser = {
        name: req.user.name,
        type: req.user.type
      };
      res.status(200).json(loggedUser);
    }
  }

  return UserController;
}
