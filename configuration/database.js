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
  'Message',
  'ServiceOrder',
  'User'
]

models.forEach(function(model) {
  module.exports[model] = sequelize.import('../model/' + model);
});

(function(m) {
  m.User.belongsTo(m.Company);
  m.ServiceOrder.hasMany(m.Message);
  m.User.hasMany(m.ServiceOrder, {as: 'Issuer', foreignKey: 'userIssuerId'});
  m.User.hasMany(m.ServiceOrder, {as: 'Responsible', foreignKey: 'userResponsibleId'});
  m.User.hasMany(m.Contact)
  m.ServiceOrder.belongsTo(m.Category);
  m.Company.hasMany(m.Category);
}) (module.exports);

exports.sequelize = sequelize;
