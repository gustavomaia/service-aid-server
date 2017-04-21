var Sequelize = require('sequelize');

var sequelize = new Sequelize('service-aid', 'gustavomaia', '', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  force: false,
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
  m.Executor.hasMany(m.ServiceOrder);
  m.ServiceOrder.hasMany(m.Message);
  m.ServiceOrder.belongsTo(m.Issuer);
  m.Company.hasMany(m.Category);
  m.Company.hasMany(m.Contact);
}) (module.exports);

exports.sequelize = sequelize;
