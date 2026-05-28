"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Speaker extends Model {
    static associate(models) {
      Speaker.hasMany(models.EventSpeaker, { foreignKey: "speaker_id" });
      Speaker.belongsToMany(models.Event, {
        through: models.EventSpeaker,
        foreignKey: "speaker_id",
        otherKey: "event_id",
        as: "events",
      });
    }
  }
  Speaker.init(
    {
      emri: { type: DataTypes.STRING, allowNull: false },
      mbiemri: { type: DataTypes.STRING, allowNull: false },
      biografia: DataTypes.TEXT,
      imazhi: DataTypes.STRING,
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    { sequelize, modelName: "Speaker" },
  );
  return Speaker;
};
