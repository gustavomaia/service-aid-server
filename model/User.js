var Sequelize = require('sequelize');
var sequelize = require('../configuration/database').sequelize;
var hashGenerator = new require('./HashGenerator');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  }, {
    instanceMethods: {
      isValidPassword: function(password) {
        return this.password == hashGenerator.generate(password);
      }
    },
    freezeTableName: true,
    force: false
  })
}
