"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.UserType, {
        foreignKey: "user_type_id",
        as: "userType",
      });
      User.hasMany(models.Event, {
        foreignKey: "organizer_id",
        as: "organizedEvents",
      });
      User.hasMany(models.Registration, {
        foreignKey: "user_id",
        as: "registrations",
      });
      User.hasMany(models.Feedback, { foreignKey: "user_id", as: "feedback" });
    }
  }
  User.init(
    {
      emri: { type: DataTypes.STRING, allowNull: false },
      mbiemri: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      passwordi: { type: DataTypes.STRING, allowNull: false },
      telefoni: DataTypes.STRING,
      fotoja: DataTypes.STRING,
      user_type_id: { type: DataTypes.INTEGER, allowNull: false },
      statusi: {
        type: DataTypes.ENUM("aktiv", "inaktiv", "banuar"),
        defaultValue: "aktiv",
      },
    },
    { sequelize, modelName: "User", tableName: "Users" },
  );
  return User;
};
