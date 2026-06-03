"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Registration extends Model {
    static associate(models) {
      Registration.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
      Registration.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Registration.belongsTo(models.Ticket, { foreignKey: "ticket_id", as: "ticket" });
      Registration.hasOne(models.Payment, {
        foreignKey: "registration_id",
        as: "payment",
      });
    }
  }
  Registration.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      ticket_id: { type: DataTypes.INTEGER, allowNull: false },
      data_regjistrimit: { type: DataTypes.DATE, allowNull: false },
      statusi: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Registration",
      tableName: "Registrations",
      timestamps: false,
    },


  );
  return Registration;
};


