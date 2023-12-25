const { DataTypes } = require('sequelize');
const sequelize = require('../utils/config');
const Company = require('./company');

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
            model : Company,
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

Office.belongsTo(Company, { foreignKey: 'companyID', as: 'company' });

module.exports = Office;