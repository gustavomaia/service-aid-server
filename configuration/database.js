var Sequelize = require('sequelize');

var sequelize = new Sequelize('service-aid', 'gustavomaia', '', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  force: true,
});

var models = [
  'Category',
  'Company',
  'Contact',
  'Executor',
  'Manager',
  'Issuer',
  'Message',
  'ServiceOrder',
  'User'
]

models.forEach(function(model) {
  module.exports[model] = sequelize.import('../model/' + model);
});

(function(m) {
  m.Executor.belongsTo(m.User);
  m.Manager.belongsTo(m.User);
  m.Issuer.belongsTo(m.User);
  m.Company.belongsTo(m.User);
  m.ServiceOrder.hasMany(m.Message);
  m.ServiceOrder.belongsTo(m.User, {as: 'Issuer', foreignKey: 'userIssuerId'});
  m.ServiceOrder.belongsTo(m.User, {as: 'Executor', foreignKey: 'userExecutorId'});
  m.Company.hasMany(m.Category);
  m.Company.hasMany(m.Contact);
}) (module.exports);

exports.sequelize = sequelize;
