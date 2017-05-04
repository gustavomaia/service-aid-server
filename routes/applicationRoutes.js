module.exports = function(app){
  let applicationController = app.controllers.ApplicationController;

  app.get('/application', applicationController.create);
}
