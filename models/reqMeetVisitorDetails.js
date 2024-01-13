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
        allowNull: false
    },
    vAnniversaryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    vDesignation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vDepartment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    //from this vPANCard to below 4, used for individual only, that's why allowNull: true
    vPANCard: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vContact: {
        type: DataTypes.STRING,
        allowNull: true
    },
    vMailID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    //upto here vMailID
    vLiveImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vPhotoID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vVisitorID: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
    paranoid: true
});

ReqMeetVisitorDetails.belongsTo(RequestMeeting, { foreignKey: 'reqMeetingID', as: 'reqMeeting' });

module.exports = ReqMeetVisitorDetails;