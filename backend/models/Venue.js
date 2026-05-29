'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      // Association removed - Events table no longer has venue_id column
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
