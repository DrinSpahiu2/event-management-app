"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EventSponsor extends Model {
    static associate(models) {
      EventSponsor.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
      EventSponsor.belongsTo(models.Sponsor, { foreignKey: "sponsor_id", as: "sponsor" });
    }
  }
  EventSponsor.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      sponsor_id: { type: DataTypes.INTEGER, allowNull: false },
      shuma: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      niveli_sponsorizimit: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    { sequelize, modelName: "EventSponsor", tableName: "EventSponsors" },
  );
  return EventSponsor;
};
