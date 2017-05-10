module.exports = function(app){
  let serviceOrderController = app.controllers.ServiceOrderController;

  app.post('/service-order', serviceOrderController.create);
  //poderia ser ao contrário, toResponsible.inProgress
  app.get('/service-order/responsible/inProgress', serviceOrderController.inProgress.toResponsible);
  app.get('/service-order/issuer/waitingManagement', serviceOrderController.waitingManagement.toIssuer);
  app.get('/service-order/manager/waitingManagement', serviceOrderController.waitingManagement.toManager);
}
