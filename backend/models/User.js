"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.UserType, {
        foreignKey: "user_type_id",
        as: "userType",
      });
    }
  }
  User.init(
    {
      emri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mbiemri: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefoni: DataTypes.STRING,
      fotoja: DataTypes.STRING,
      user_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      statusi: {
        type: DataTypes.ENUM("aktiv", "inaktiv", "banuar"),
        defaultValue: "aktiv",
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
