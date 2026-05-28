"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Sponsor extends Model {
    static associate(models) {
      Sponsor.hasMany(models.EventSponsor, { foreignKey: "sponsor_id" });
      Sponsor.belongsToMany(models.Event, {
        through: models.EventSponsor,
        foreignKey: "sponsor_id",
        otherKey: "event_id",
        as: "events",
      });
    }
  }
  Sponsor.init(
    {
      emertimi: { type: DataTypes.STRING, allowNull: false },
      logoja: DataTypes.STRING,
      website: DataTypes.STRING,
      niveli_sponsorizimit: DataTypes.STRING,
    },
    { sequelize, modelName: "Sponsor", tableName: "Sponsors" },
  );
  return Sponsor;
};
