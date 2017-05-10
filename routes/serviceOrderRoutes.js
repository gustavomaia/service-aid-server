module.exports = function(app){
  let serviceOrderController = app.controllers.ServiceOrderController;

  app.post('/service-order', serviceOrderController.create);
  //poderia ser ao contrário, toExecutor.inProgress
  app.get('/service-order/executor/inProgress', serviceOrderController.inProgress.toExecutor);
  app.get('/service-order/issuer/waitingManagement', serviceOrderController.waitingManagement.toIssuer);
  app.get('/service-order/manager/waitingManagement', serviceOrderController.waitingManagement.toManager);
}
