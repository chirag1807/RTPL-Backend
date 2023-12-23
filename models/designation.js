const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Department = require('./department');

const Designation = sequelize.define('Designation', {
    designationID : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    designation: {
       type: DataTypes.STRING,
       allowNull: true,
    },
    departmentID:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model : Department,
            key:'departmentID',
        },
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

module.exports = Designation;