module.exports = function(app) {
  var serviceOrderController = {
    create: function(req, res) {

      res.sendStatus(201);
    }
  }

  return serviceOrderController;
}
