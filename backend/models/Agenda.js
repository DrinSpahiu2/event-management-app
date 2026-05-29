'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    static associate(models) {
      Agenda.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
    }
  }
  Agenda.init(
    {
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      start_time: { type: DataTypes.DATE, allowNull: false },
      end_time: { type: DataTypes.DATE, allowNull: false }
    },
    { sequelize, modelName: 'Agenda', tableName: 'Agenda', timestamps: false }
  );
  return Agenda;
};
