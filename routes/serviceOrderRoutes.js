module.exports = function(app){
  let serviceOrderController = app.controllers.ServiceOrderController;

  app.post('/service-order', serviceOrderController.create);
  app.get('/service-order/executor/inProgress', serviceOrderController.inProgress.toExecutor);
  app.get('/service-order/executor/finished', serviceOrderController.finished.toExecutor);
  app.get('/service-order/issuer/waitingManagement', serviceOrderController.waitingManagement.toIssuer);
  app.get('/service-order/issuer/inProgress', serviceOrderController.inProgress.toIssuer);
  app.get('/service-order/issuer/finished', serviceOrderController.finished.toIssuer);
  app.get('/service-order/manager/waitingManagement', serviceOrderController.waitingManagement.toManager);
  app.get('/service-order/manager/inProgress', serviceOrderController.inProgress.toManager);
  app.get('/service-order/manager/finished', serviceOrderController.finished.toManager);
  app.post('/service-order/:serviceOrderCode/manage', serviceOrderController.manage);
  app.get('/service-order/:serviceOrderCode', serviceOrderController.getServiceOrder);
  app.post('/service-order/:serviceOrderCode/message', serviceOrderController.newMessage);
  app.post('/service-order/:serviceOrderCode/finish', serviceOrderController.finish);
}
