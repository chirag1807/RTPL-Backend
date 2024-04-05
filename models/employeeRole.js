const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config");

// EmployeeRole model
const EmployeeRole = sequelize.define("EmployeeRoles", {
  roleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deletedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = EmployeeRole;
