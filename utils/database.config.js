const Sequelize = require("sequelize");
require('dotenv').config();

const USER = process.env.USER || "root"
const PASSWORD = process.env.PASSWORD || ""
const HOST = process.env.HOST || "localhost"
const DATABASE = process.env.DATABASE || "rtpl_database"

const sequelize = new Sequelize(DATABASE,USER,PASSWORD, 
    {
        host: HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
});

module.exports = sequelize;