const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Office = require('./office');

const ConferenceRoom = sequelize.define('ConferenceRoom', {
    conferenceRoomID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    officeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Office,
          key: 'officeID',
        },
    },
    conferenceRoomName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
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

ConferenceRoom.belongsTo(Office, { foreignKey: 'officeID', as: 'office' });

module.exports = ConferenceRoom;