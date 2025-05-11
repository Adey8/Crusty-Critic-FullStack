'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const config = require('../config/config');

console.log('Initializing Sequelize with config:', {
  database: config.database,
  username: config.username,
  host: config.host,
  dialect: config.dialect
});

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

const models = {};

// Read all model files
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    console.log(`Loading model from file: ${file}`);
    try {
      const model = require(path.join(__dirname, file))(sequelize);
      console.log(`Successfully loaded model: ${model.name}`);
      models[model.name] = model;
    } catch (error) {
      console.error(`Error loading model from ${file}:`, error);
    }
  });

// Set up associations
Object.keys(models).forEach(modelName => {
  console.log(`Setting up associations for model: ${modelName}`);
  if (models[modelName].associate) {
    try {
      models[modelName].associate(models);
      console.log(`Successfully set up associations for ${modelName}`);
    } catch (error) {
      console.error(`Error setting up associations for ${modelName}:`, error);
    }
  }
});

console.log('Available models:', Object.keys(models));

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Export models and sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  ...models
};