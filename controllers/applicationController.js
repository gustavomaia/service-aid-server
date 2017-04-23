var db = require('../configuration/database');

module.exports = function(app) {
  var serviceOrderController = {
    create: function(req, res, next) {
      let loggedUser = req.user;
      db.User.findById(loggedUser.id).then(function(foundUser) {
        if (foundUser) {
          var appResponse;

          if (foundUser.type == 'issuer') {
            db.ServiceOrder.findAll({where: {userIssuerId: loggedUser.id}}).then(function (foundServiceOrders) {
              appResponse = {serviceOrders: foundServiceOrders, userType: foundUser.type};
              res.status(200).json(appResponse);
            });
          }
        }
      });
    }
  }

  return serviceOrderController;
}
