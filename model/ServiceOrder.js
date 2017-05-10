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
    contactPhoneNumber: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    limitDate: {
      type: Sequelize.DATEONLY
    },
    code: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
    force: false
  })
}
