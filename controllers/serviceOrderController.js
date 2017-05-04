var db = require('../configuration/database');

module.exports = function(app) {
  let ServiceOrderController = {
    create: function(req, res) {
      let serviceOrderRequest = req.body;

      db.ServiceOrder
        .create({description: serviceOrderRequest.description, place: serviceOrderRequest.place, status: 'waiting_management'}).then(function (newOS) {
            newOS.setIssuer(req.user);
        });

      res.sendStatus(201);
    },
  issuer: function(req, res) {
      let loggedUser = req.user;
      db.ServiceOrder.findAll({
        where: {
          userIssuerId: loggedUser.id,
          status: 'managed'
        }
      }).then(function (foundManagedServiceOrders) {
        db.ServiceOrder.findAll({
          where: {
            userIssuerId: loggedUser.id,
            status: 'waiting_management'
          }
        })
        .then(function (foundWaitingManagementServiceOrders) {
          let response = {
            managed: foundManagedServiceOrders,
            waitingManagement: foundWaitingManagementServiceOrders
          }

          res.status(200).json(response)
          }
        )
      });
    }
  }

  return ServiceOrderController;
}
