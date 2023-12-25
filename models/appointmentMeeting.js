const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Employee = require('./employee');

const AppointmentMeeting = sequelize.define('AppointmentMeeting', {
    appointmentMeetingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

AppointmentMeeting.belongsTo(Employee, { foreignKey: 'empId', as: 'appointee' });

module.exports = AppointmentMeeting;