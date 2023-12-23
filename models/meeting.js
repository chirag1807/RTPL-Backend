const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Office = require('./office');
const RequestMeeting = require('./requestMeeting');
const MeetingType = require('./meetingType');
const MeetingMode = require('./meetingMode');

const Meeting = sequelize.define('Meetings', {
    meetingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    officeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Office,
          key: 'officeID',
        },
    },
    requestID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: RequestMeeting,
          key: 'visitorID',
        },
    },
    meetingTypeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: MeetingType,
          key: 'meetingTypeID',
        },
    },
    meetingModeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: MeetingMode,
          key: 'meetingModeID',
        },
    },
    MeetingRoom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    MeetingPurpose: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    meetingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    meetingTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isReschedule: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    rescMeetingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    rescMeetingTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    rescMeetingRoom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true
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

Meeting.belongsTo(Office, { foreignKey: 'officeID', as: 'office' });
Meeting.belongsTo(RequestMeeting, { foreignKey: 'visitorID', as: 'requestMeeting' });
Meeting.belongsTo(MeetingType, { foreignKey: 'meetingTypeID', as: 'meetingType' });
Meeting.belongsTo(MeetingMode, { foreignKey: 'meetingModeID', as: 'meetingMode' });

module.exports = Meeting;