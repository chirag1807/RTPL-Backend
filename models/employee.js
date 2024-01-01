const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const EmployeeRole = require('./employeeRole');
const Company = require('./company');
const Office = require('./office');
const Department = require('./department');
const Designation = require('./designation');

const Employee = sequelize.define('Employees', {
  empId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  empProfileImg: {
    type: DataTypes.STRING,
    allowNull: true
  },
  empIdCard: {
    type: DataTypes.STRING,
    allowNull: true
  },
  empAadharCard: {
    type: DataTypes.STRING,
    allowNull: true
  },
  aadharNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  featureString: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isRecept: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
});

// Employee.belongsTo(EmployeeRole, {
//   as: 'role',
//   foreignKey: {
//     name: 'roleID', allowNull: false
//   }
// })
// Employee.belongsTo(Company, { foreignKey: 'companyID', as: 'companyDetails' });
// Employee.belongsTo(Office, { foreignKey: 'officeID', as: 'officeDetails' });
// Employee.belongsTo(Department, { foreignKey: 'departmentID', as: 'employeeDepartment' });
// Employee.belongsTo(Designation, { foreignKey: 'designationID', as: 'employeeDesignation' });

module.exports = Employee;
