"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserType extends Model {}
  UserType.init(
    {
      emri: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      pershkrimi: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "UserType",
    },
  );
  return UserType;
};
