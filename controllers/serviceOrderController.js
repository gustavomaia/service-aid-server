var db = require('../configuration/database');

module.exports = function(app) {
  var serviceOrderController = {
    create: function(req, res) {
      // debugger;

      let x = req.body;

      console.log(req.user.id);
      // console.log(x.description);
      // preciso setar o user
      db.ServiceOrder
        .create({description: x.description, place: x.place, status: 'created'}).then(function (newOS) {
            newOS.setIssuer(req.user);
        });
      res.sendStatus(201);
    }
  }

  return serviceOrderController;
}
