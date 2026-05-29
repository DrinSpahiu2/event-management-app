"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
      Feedback.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    }
  }
  Feedback.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      vleresimi: { type: DataTypes.INTEGER, allowNull: false },
      komenti: DataTypes.TEXT,
      data: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: "Feedback", tableName: "Feedback", timestamps: false },
  );
  return Feedback;
};
