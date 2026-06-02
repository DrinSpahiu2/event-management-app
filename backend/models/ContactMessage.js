"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContactMessage extends Model {
    static associate() {}
  }

  ContactMessage.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      emri: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false },
      subjekti: { type: DataTypes.STRING(255), allowNull: false },
      mesazhi: { type: DataTypes.TEXT, allowNull: false },
      statusi: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      pergjigja: { type: DataTypes.TEXT, allowNull: true },
      data_dergimit: { type: DataTypes.DATE, allowNull: false },
      data_pergjigjes: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "ContactMessage",
      tableName: "ContactMessages",
    },
  );

  return ContactMessage;
};
