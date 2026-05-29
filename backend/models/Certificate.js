'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    static associate(models) {
      Certificate.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Certificate.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
    }
  }
  Certificate.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      kodi: { type: DataTypes.STRING, allowNull: false },
      data_leshimit: { type: DataTypes.DATE, allowNull: false }
    },
    { sequelize, modelName: 'Certificate', tableName: 'Certificates', timestamps: false }
  );
  return Certificate;
};
