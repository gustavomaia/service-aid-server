var db = require('../configuration/database');

module.exports = function(app) {
  let CompanyController = {
    getInfo: function(req, res) {
      let loggedUser = req.user;
      req.user
        .getCompany({
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id']
          },
          include: [{
            model: db.Category,
            attributes: {
              exclude:['createdAt', 'updatedAt', 'companyId']
            }
          }]
        })
        .then(company => {
          res.status(200).json(company);
        });
    }
  }

  return CompanyController;
}
