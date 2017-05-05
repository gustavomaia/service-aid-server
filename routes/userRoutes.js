module.exports = function(app){
  let userController = app.controllers.UserController;

  app.get('/user', userController.get);
}
