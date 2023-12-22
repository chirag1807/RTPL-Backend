const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./../utils/database.config');

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
            model : 'Departments',
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
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Designation;