module.exports = function(app){
  let companyController = app.controllers.CompanyController;

  app.get('/company', companyController.getInfo);
}
