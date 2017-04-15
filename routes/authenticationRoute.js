module.exports = function(app) {
  app.all('/', app.controllers.authenticationController);
}
