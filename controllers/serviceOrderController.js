var db = require('../configuration/database');

module.exports = function(app) {
  var serviceOrderController = {
    create: function(req, res) {
      // debugger;

      let x = req.body;

      console.log(req.user.id);
      // console.log(x.description);
      //
      db.ServiceOrder
        .create({description: x.description, place: x.place, status: 'created'}).then(function (newOS) {
          db.Issuer.findOne({where: {userId: req.user.id}}).then(function(foundIssuer) {
            newOS.setIssuer(foundIssuer);
            // newOS.save();
          });
        });
      // ServiceOrder.
      res.sendStatus(201);
    }
  }

  return serviceOrderController;
}
