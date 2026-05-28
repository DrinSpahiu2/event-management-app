"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserType extends Model {
    // ADD THIS BLOCK FOR RELATIONSHIPS:
    static associate(models) {
      UserType.hasMany(models.User, {
        foreignKey: "user_type_id",
        as: "users",
      });
    }
  }
  
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