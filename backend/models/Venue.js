'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.hasMany(models.Event, { foreignKey: 'venue_id', as: 'events' });
    }
  }
  Venue.init(
    {
      emri: { type: DataTypes.STRING, allowNull: false },
      adresa: { type: DataTypes.STRING, allowNull: false },
      qyteti: { type: DataTypes.STRING, allowNull: false },
      kapaciteti: { type: DataTypes.INTEGER, allowNull: false }
    },
    { sequelize, modelName: 'Venue', tableName: 'Venues', timestamps: false }
  );
  return Venue;
};
