var Sequelize = require('sequelize');
var sequelize = require('../configuration/database').sequelize;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contact', {
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.STRING
    },
    cellphone_number: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
    force: false
  })
}
