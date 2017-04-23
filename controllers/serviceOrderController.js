var db = require('../configuration/database');

module.exports = function(app) {
  var serviceOrderController = {
    create: function(req, res) {
      let serviceOrderRequest = req.body;

      db.ServiceOrder
        .create({description: serviceOrderRequest.description, place: serviceOrderRequest.place, status: 'created'}).then(function (newOS) {
            newOS.setIssuer(req.user);
        });

      res.sendStatus(201);
    }
  }

  return serviceOrderController;
}
