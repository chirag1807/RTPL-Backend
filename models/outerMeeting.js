const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Meeting = require('./meeting');

const OuterMeeting = sequelize.define('OuterMeeting', {
    outerMeetingID: {
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
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientDesignation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientContact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientVenue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
        validate: {
          isIn: [['Pending', 'Accepted', 'Rejected']],
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

OuterMeeting.belongsTo(Meeting, { foreignKey: 'meetingID', as: 'meeting' });

module.exports = OuterMeeting;