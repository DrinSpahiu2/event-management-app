"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Registration, {
        foreignKey: "registration_id",
        as: "registration",
      });
    }
  }
  Payment.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      registration_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      shuma: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      metoda: { type: DataTypes.STRING, allowNull: false },
      data: { type: DataTypes.DATE, allowNull: false },
      statusi: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
    },
    { sequelize, modelName: "Payment", tableName: "Payments" },
  );
  return Payment;
};
