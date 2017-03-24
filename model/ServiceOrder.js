var Sequelize = require('sequelize');
var sequelize = require('../configuration/database').sequelize;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('service_order', {
    description: {
      type: Sequelize.TEXT
    },
    place: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    limit_date: {
      type: Sequelize.DATEONLY
    }
  }, {
    freezeTableName: true,
    force: false
  })
}