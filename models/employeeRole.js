const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');

// EmployeeRole model
const EmployeeRole = sequelize.define('EmployeeRoles', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  });

module.exports = EmployeeRole;