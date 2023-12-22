const { DataTypes } = require('sequelize');
const sequelize = require('./../utils/database.config');

const Meeting = sequelize.define('Meeting', {
    meetingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    requestID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'RequestMeeting',
          key: 'visitorID',
        },
    },
    officeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Office',
          key: 'officeID',
        },
    },
    meetingTypeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'MeetingType',
          key: 'MeetingTypeID',
        },
    },
    meetingModeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'MeetingMode',
          key: 'MeetingModeID',
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

module.exports = Meeting;