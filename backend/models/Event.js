'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Event extends Model {}
  Event.init({
    titulli: DataTypes.STRING,
    pershkrimi: DataTypes.TEXT,
    data_fillimit: DataTypes.DATE,
    data_perfundimit: DataTypes.DATE,
    lokacioni: DataTypes.STRING,
    kapaciteti: DataTypes.INTEGER,
    statusi: DataTypes.ENUM('aktiv', 'anuluar', 'perfunduar'),
    organizer_id: DataTypes.INTEGER,
    imazhi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};