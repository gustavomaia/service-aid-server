module.exports = function(app){
  var serviceOrderController = app.controllers.serviceOrderController;

  app.post('/service-order', serviceOrderController.create);
}
