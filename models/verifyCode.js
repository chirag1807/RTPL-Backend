const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config");

const VeirfyCode = sequelize.define("MeetingModes", {
    verificationCodeID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    verificationCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresIn: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

module.exports = VeirfyCode;
