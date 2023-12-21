const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./../utils/database.config');

// EmployeeRole model
const EmployeeRole = sequelize.define('EmployeeRole', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  });

  module.exports = EmployeeRole;