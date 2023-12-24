const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Employee = require('./employee');
const Meeting = require('./meeting');

const InternalTeamSelect = sequelize.define('Meetings', {
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
          key: 'empID',
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
    }
}, {
    timestamps: true,
    paranoid: true
});

InternalTeamSelect.belongsTo(Employee, { foreignKey: 'empId', as: 'employee' });
InternalTeamSelect.belongsTo(Meeting, { foreignKey: 'meetingID', as: 'meeting' });

module.exports = InternalTeamSelect;