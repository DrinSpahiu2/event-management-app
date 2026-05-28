"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User, {
        foreignKey: "organizer_id",
        as: "organizer",
      });

      Event.hasMany(models.Ticket, { foreignKey: "event_id", as: "tickets" });
      Event.hasMany(models.Registration, {
        foreignKey: "event_id",
        as: "registrations",
      });
      Event.hasMany(models.Feedback, { foreignKey: "event_id", as: "feedback" });

      Event.hasMany(models.EventSpeaker, { foreignKey: "event_id" });
      Event.belongsToMany(models.Speaker, {
        through: models.EventSpeaker,
        foreignKey: "event_id",
        otherKey: "speaker_id",
        as: "speakers",
      });

      Event.hasMany(models.EventSponsor, { foreignKey: "event_id" });
      Event.belongsToMany(models.Sponsor, {
        through: models.EventSponsor,
        foreignKey: "event_id",
        otherKey: "sponsor_id",
        as: "sponsors",
      });
    }
  }
  Event.init(
    {
      titulli: DataTypes.STRING,
      pershkrimi: DataTypes.TEXT,
      data_fillimit: DataTypes.DATE,
      data_perfundimit: DataTypes.DATE,
      lokacioni: DataTypes.STRING,
      kapaciteti: DataTypes.INTEGER,
      statusi: DataTypes.ENUM("aktiv", "anuluar", "perfunduar"),
      publication_status: DataTypes.ENUM("draft", "published"),
      organizer_id: DataTypes.INTEGER,
      imazhi: DataTypes.STRING,
    },
    { sequelize, modelName: "Event", tableName: "Events" },
  );
  return Event;
};
