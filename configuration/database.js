var Sequelize = require('sequelize');

var sequelize = new Sequelize('service-aid', 'gustavomaia', '', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

exports.sequelize = sequelize;

sequelize.import("../model/service-order")
