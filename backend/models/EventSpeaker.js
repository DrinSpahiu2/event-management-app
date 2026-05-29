"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EventSpeaker extends Model {
    static associate(models) {
      EventSpeaker.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
      EventSpeaker.belongsTo(models.Speaker, { foreignKey: "speaker_id", as: "speaker" });
    }
  }
  EventSpeaker.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      speaker_id: { type: DataTypes.INTEGER, allowNull: false },
      tema: { type: DataTypes.STRING, allowNull: false },
      ora: { type: DataTypes.TIME, allowNull: false },
      assignment_status: {
        type: DataTypes.ENUM("pending", "accepted", "declined"),
        defaultValue: "pending",
      },
      checked_in: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { sequelize, modelName: "EventSpeaker", tableName: "EventSpeakers" },
  );
  return EventSpeaker;
};
