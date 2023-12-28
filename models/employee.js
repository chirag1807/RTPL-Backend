const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const EmployeeRole = require('./employeeRole');

const Employee = sequelize.define('Employees', {
  empID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emp_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Office: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deletedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  timestamps: true,
  paranoid: true
});

// Employee.belongsTo(EmployeeRole, {
//   as: 'role',
//   foreignKey: {
//     name: 'roleID', allowNull: false
//   }
// })


module.exports = Employee;
