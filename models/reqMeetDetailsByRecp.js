const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Employee = require('./employee');
const Company = require('./company');
const Office = require('./office');
const Department = require('./department');
const Designation = require('./designation');

const ReqMeetDetailsByRecp = sequelize.define('ReqMeetDetailsByRecp', {
    reqMeetDetailsID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model : Company,
            key:'companyID',
        },
    },
    officeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Office,
          key: 'officeID',
        },
    },
    departmentID:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Department,
            key:'departmentID',
        },
    },
    designationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Designation,
            key: 'designationID'
        }
    },
    emp_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    empId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key:'empId',
        },
    },
    emp_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TokenNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: true,
    paranoid: true
});

ReqMeetDetailsByRecp.belongsTo(Company, { foreignKey: 'companyID', as: 'company' });
ReqMeetDetailsByRecp.belongsTo(Office, { foreignKey: 'officeID', as: 'office' });
ReqMeetDetailsByRecp.belongsTo(Department, { foreignKey: 'departmentID', as: 'department' });
ReqMeetDetailsByRecp.belongsTo(Designation, {foreignKey: 'designationID', as: 'designation'});
ReqMeetDetailsByRecp.belongsTo(Employee, {foreignKey: 'empId', as: 'employee'});

module.exports = ReqMeetDetailsByRecp;