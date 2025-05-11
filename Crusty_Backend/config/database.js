const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: console.log,
    pool: config.pool
  }
);

module.exports = sequelize;