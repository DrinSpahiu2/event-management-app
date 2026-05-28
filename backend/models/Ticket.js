"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      Ticket.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
      Ticket.hasMany(models.Registration, { foreignKey: "ticket_id" });
    }
  }
  Ticket.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: DataTypes.INTEGER,
      lloji: DataTypes.STRING,
      cmimi: DataTypes.DECIMAL(10, 2),
      sasia_disponueshme: DataTypes.INTEGER,
    },
    { sequelize, modelName: "Ticket", tableName: "Tickets", timestamps: false },
  );
  return Ticket;
};
