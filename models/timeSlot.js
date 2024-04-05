const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Meeting = require('../models/meeting');

const TimeSlot = sequelize.define('TimeSlot', {
    timeSlotID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    meetingID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Meeting,
            key: 'meetingID'
        }
    },
    meetingStartTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    meetingEndTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    meetingDate : {
        type: DataTypes.CHAR,
        allowNull: true,
    },
    conferenceRoomID : {
        type : DataTypes.TIME,
        allowNull : false   
    },
    status:{
        type: DataTypes.CHAR,
        allowNull: false,
    }
}, {
    timestamps: true
});

Meeting.hasMany(TimeSlot, { foreignKey: 'meetingID', as: 'timeSlot' });
TimeSlot.belongsTo(Meeting, { foreignKey: 'meetingID', as: 'meeting' });
module.exports = TimeSlot;