const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const RequestMeeting = require('./requestMeeting');

const ReqMeetVisitorDetails = sequelize.define('ReqMeetVisitorDetails', {
    visitorID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reqMeetingID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: RequestMeeting,
          key: 'reqMeetingID',
        },
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
    vImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vIDDoc: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
    paranoid: true
});

ReqMeetVisitorDetails.belongsTo(RequestMeeting, { foreignKey: 'reqMeetingID', as: 'reqMeeting' });

module.exports = ReqMeetVisitorDetails;