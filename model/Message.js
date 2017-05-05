var Sequelize = require('sequelize');
var sequelize = require('../configuration/database').sequelize;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('message', {
    message: {
      type: Sequelize.TEXT
    },
    author: {
      type: Sequelize.TEXT
    }
  }, {
    freezeTableName: true,
    force: false
  })
}
