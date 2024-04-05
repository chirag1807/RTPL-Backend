const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');

const Department = sequelize.define('Departments', {
    departmentID : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    department: {
       type: DataTypes.STRING,
       allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
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

module.exports = Department;