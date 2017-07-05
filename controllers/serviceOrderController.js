var db = require('../configuration/database');

module.exports = function(app) {
  let ServiceOrderController = {
    finish: function(req, res){
      db.ServiceOrder.findOne({
        where: {
          code: req.params.serviceOrderCode,
          status: 'in_progress'
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId',
          'description', 'place', 'contactPhoneNumber', 'status', 'limitDate', 'code']
        },
      }).then(serviceOrder=>{
        serviceOrder.update({status: 'finished'}).then(() => {
          db.Message.create({
            message: 'Ordem de serviço finalizada',
            author: req.user.name,
            serviceOrderId: serviceOrder.id
          }).then(newMessage=>{
            res.status(201).send();
          })
        })
      })
    },
    newMessage: function(req, res) {
      db.ServiceOrder.findOne({
        where: {
          code: req.params.serviceOrderCode
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId', 
          'description', 'place', 'contactPhoneNumber', 'status', 'limitDate', 'code']
        },
      }).then(serviceOrder=>{
        db.Message.create({
          message: req.body.message,
          author: req.user.name,
          serviceOrderId: serviceOrder.id
        }).then(newMessage=>{
          res.status(201).json(newMessage)
        })
      })
    },
    manage: function(req, res) {
      db.ServiceOrder.findOne({
        where: {
          code: req.params.serviceOrderCode
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'categoryId', 'companyId', 'userIssuerId', 
          'description', 'place', 'contactPhoneNumber', 'status', 'code']
        },
      }).then(serviceOrder=>{
        serviceOrder.update({status: 'in_progress', limitDate: req.body.limitDate, userExecutorId: req.body.executorId}).then(() => {
          db.Message.create({
            message: 'Acabei de definir um responsável pela sua ordem de serviço e em breve ele resolverá seu problema.',
            author: req.user.name,
            serviceOrderId: serviceOrder.id
          }).then(newMessage=>{
            res.status(201).send();
          })
        })
      })
    },
    getServiceOrder: function(req, res) {
        db.ServiceOrder.findAll({
                where: {
                  code: req.params.serviceOrderCode
                },
                attributes: {
                  exclude: ['id', 'createdAt', 'updatedAt', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId']
                },
                include: [{
                  model: db.Company,
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'id']
                  }
                }, {
                  model: db.Message,
                  attributes: {
                    exclude:['updatedAt', 'id', 'serviceOrderId']
                  }
                },{
                  model: db.User,
                  as: 'Issuer',
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'type', 'id', 'password']
                  }
                }, {
                  model: db.User,
                  as: 'Executor',
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'type', 'id', 'password']
                  }
                }]
              })
          .then(serviceOrder => {
            res.status(200).send(serviceOrder);
          })
    },
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
            author: 'Sistema'
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
      toManager: function(req, res) {
        db.ServiceOrder.findAll({
                where: {
                  companyId: req.user.companyId,
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
                }, {
                  model: db.User,
                  as: 'Executor',
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
        db.ServiceOrder.findAll({
                where: {
                  userIssuerId: req.user.id,
                  status: 'in_progress'
                },
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'id', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId', 'contactPhoneNumber']
                },
                include: [{
                  model: db.Category,
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'id']
                  }
                }, {
                  model: db.User,
                  as: 'Executor',
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'type', 'id', 'password']
                  }
                }]
              })
          .then(ordersWaitingManagement => {
            res.status(200).json({inProgress: ordersWaitingManagement});
          })
      },
    },
    finished: {
      toManager: function(req, res) {
        db.ServiceOrder.findAll({
                where: {
                  companyId: req.user.companyId,
                  status: 'finished'
                },
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'id', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId', 'contactPhoneNumber', 'limitDate']
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
                }, {
                  model: db.User,
                  as: 'Executor',
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'type', 'id', 'password']
                  }
                }]
              })
          .then(ordersWaitingManagement => {
            res.status(200).json(ordersWaitingManagement);
          })
      },
      toIssuer: function(req, res) {
        db.ServiceOrder.findAll({
                where: {
                  userIssuerId: req.user.id,
                  status: 'finished'
                },
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'id', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId', 'contactPhoneNumber', 'limitDate']
                },
                include: [{
                  model: db.Category,
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'id']
                  }
                }, {
                  model: db.User,
                  as: 'Executor',
                  attributes: {
                    exclude:['createdAt', 'updatedAt', 'companyId', 'type', 'id', 'password']
                  }
                }]
              })
          .then(ordersWaitingManagement => {
            res.status(200).json(ordersWaitingManagement);
          })
      },
      toExecutor: function(req, res) {
        db.ServiceOrder.findAll({
                where: {
                  userExecutorId: req.user.id,
                  status: 'finished'
                },
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'id', 'userExecutorId', 'categoryId', 'companyId', 'userIssuerId', 'contactPhoneNumber', 'limitDate']
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
            res.status(200).json(ordersWaitingManagement);
          })
      },
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
