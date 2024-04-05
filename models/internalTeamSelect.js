const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Employee = require('./employee');
const Meeting = require('./meeting');

const InternalTeamSelect = sequelize.define('InternalTeamSelection', {
    internalTeamSelectID: {
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
    empId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Employee,
          key: 'empId',
        },
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
    },
    isAttended: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    timestamps: true,
    paranoid: true
});

Meeting.hasMany(InternalTeamSelect, { foreignKey: 'meetingID', as: 'internalTeamSelect' });
InternalTeamSelect.belongsTo(Meeting, { foreignKey: 'meetingID', as: 'meeting' });
InternalTeamSelect.belongsTo(Employee, { foreignKey: 'empId', as: 'employee' });

module.exports = InternalTeamSelect;