const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./../utils/database.config');

const Office = sequelize.define('Offices', {
    officeID : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    companyID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model : 'Companies',
            key:'companyID',
        },
    },
    Address: {
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

module.exports = Office;