const { DataTypes } = require('sequelize');
const sequelize = require('./../utils/database.config');

const RequestMeeting = sequelize.define('RequestMeeting', {
    visitorID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vFirstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vLastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vDateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    vAnniversaryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    vDesignation: {
        type: DataTypes.STRING,
        allowNull: false
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
    purposeOfMeerting: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vIDDoc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    empId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Employee',
          key: 'empID',
        },
    },
    TokenNumber: {
        type: DataTypes.STRING,
        allowNull: true
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

module.exports = RequestMeeting;