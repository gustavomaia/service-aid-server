var db = require('../configuration/database');

module.exports = function(app) {
  let ServiceOrderController = {
    create: function(req, res) {
      let serviceOrderRequest = req.body;

      db.ServiceOrder
        .create({
          description: serviceOrderRequest.description,
          place: serviceOrderRequest.place,
          contactPhoneNumber: serviceOrderRequest.contactPhoneNumber,
          categoryId: serviceOrderRequest.categoryId,
          userIssuerId: req.user.id,
          companyId: req.user.companyId,
          status: 'waiting_management',
          code: (Date.now().toString(36) + Math.random().toString(36)).substr(10, 5).toUpperCase(),
          messages: [{
            message: 'Ordem de serviço criada com sucesso. Aguarde a definição de um responsável!',
            author: 'system'
          }]
        }, {
          include: [db.Message]
        })
        .then(function (newOS) {
            let response = {
              code: newOS.code,
              place: newOS.place,
              description: newOS.description,
              messages: newOS.messages,
            }
            res.status(201).json(response);
        });
    },
    inProgress: {
      toExecutor: function(req, res) {
        db.ServiceOrder.findAll({
                where: {
                  userExecutorId: req.user.id,
                  status: 'in_progress'
                },
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'id', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId']
                },
                include: [{
                  model: db.Category,
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'id']
                  }
                }, {
                  model: db.User,
                  as: 'Issuer',
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'type', 'id', 'password']
                  }
                }]
              })
          .then(ordersWaitingManagement => {
            res.status(200).send(ordersWaitingManagement);
          })
      },
      toIssuer: function(req, res) {

      }
    },
    waitingManagement: {
      toManager: function(req, res) {
        db.ServiceOrder.findAll({
                where: {
                  companyId: req.user.companyId,
                  status: 'waiting_management'
                },
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'id', 'limitDate', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId']
                },
                include: [{
                  model: db.Category,
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'id']
                  }
                }, {
                  model: db.User,
                  as: 'Issuer',
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'type', 'id', 'password']
                  }
                }]
              })
          .then(ordersWaitingManagement => {
            res.status(200).send(ordersWaitingManagement);
          })
      },
      toIssuer: function(req, res) {
        let loggedUser = req.user;
        db.ServiceOrder.findAll({
          where: {
            userIssuerId: loggedUser.id,
            status: 'managed'
          }
        }).then(function (foundManagedServiceOrders) {
          db.ServiceOrder.findAll({
            where: {
              userIssuerId: loggedUser.id,
              status: 'waiting_management'
            }
          }).then(function (foundWaitingManagementServiceOrders) {
            let response = {
              managed: foundManagedServiceOrders,
              waitingManagement: foundWaitingManagementServiceOrders
            }

            res.status(200).json(response)
          })
        });
      }
    }
  }

  return ServiceOrderController;
}
