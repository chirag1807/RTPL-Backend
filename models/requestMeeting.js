const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
// const Employee = require('./employee');
const ReqMeetingDetailsByRecp = require('./reqMeetDetailsByRecp');

const RequestMeeting = sequelize.define('RequestMeetings', {
    reqMeetingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    typeOfVisitor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['Company', 'Individual']],
        },
    },
    vCompanyName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vCompanyIndustry: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vCompanyAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vCompanyContact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vCompanyEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vCompanyGST: {
        type: DataTypes.STRING,
        allowNull: true
    },
    purposeOfMeeting: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPersonName: {
        type: DataTypes.STRING,
        allowNull: false,
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

// RequestMeeting.belongsTo(Employee, { foreignKey: 'empId', as: 'employee' });
RequestMeeting.belongsTo(ReqMeetingDetailsByRecp, { foreignKey: 'reqMeetDetailsID', as: 'reqMeetDetailsByRecp' });

module.exports = RequestMeeting;