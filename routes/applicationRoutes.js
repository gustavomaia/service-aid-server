module.exports = function(app){
  var applicationController = app.controllers.applicationController;

  app.get('/application', applicationController.create);
}
