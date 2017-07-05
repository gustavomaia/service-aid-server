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
    },
    getExecutors: function(req, res) {
      let loggedUser = req.user;
      db.User.findAll({
        where: {
          companyId: loggedUser.companyId,
          type: ['executor', 'manager']
        },
        attributes: {
          exclude: ['email', 'password', 'type', 'createdAt', 'updatedAt', 'companyId']
        }
      })
      .then(serviceOrder => {
        res.status(200).send(serviceOrder);
      })
    }
  }

  return CompanyController;
}
