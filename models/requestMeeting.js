const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Employee = require('./employee');
const ReqMeetingDetailsByRecp = require('./reqMeetDetailsByRecp');

const RequestMeeting = sequelize.define('RequestMeetings', {
    reqMeetingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vCompanyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vCompanyAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vCompanyContact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vCompanyEmail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    purposeOfMeeting: {
        type: DataTypes.STRING,
        allowNull: false
    },
    empId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Employee,
          key: 'empID',
        },
    },
    reqMeetDetailsID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: ReqMeetingDetailsByRecp,
          key: 'reqMeetDetailsID',
        },
    },
    ReqStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
          isIn: [['Pending', 'ReceptionistAccepted', 'ReceptionistRejected', 'EMployeeAccepted', 'EmployeeRejected']],
        },
    },
    DeclineReason: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    paranoid: true
});

RequestMeeting.belongsTo(Employee, { foreignKey: 'empId', as: 'employee' });
RequestMeeting.belongsTo(ReqMeetingDetailsByRecp, { foreignKey: 'reqMeetDetailsID', as: 'reqMeetDetailsByRecp' });

module.exports = RequestMeeting;