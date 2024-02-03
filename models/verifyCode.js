const { DataTypes } = require("sequelize");
const sequelize = require("../utils/config");

const VerifyCode = sequelize.define("VerifyCode", {
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
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

module.exports = VerifyCode;
