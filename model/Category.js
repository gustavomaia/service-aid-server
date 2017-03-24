var Sequelize = require('sequelize');
var sequelize = require('../configuration/database').sequelize;

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    name: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
    force: false
  })
}
