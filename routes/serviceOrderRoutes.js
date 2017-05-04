module.exports = function(app){
  let serviceOrderController = app.controllers.ServiceOrderController;

  app.post('/service-order', serviceOrderController.create);
  app.get('/service-order/issuer', serviceOrderController.issuer);
}
