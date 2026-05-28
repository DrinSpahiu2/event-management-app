'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Notification.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      mesazhi: { type: DataTypes.TEXT, allowNull: false },
      data_dergimit: { type: DataTypes.DATE, allowNull: false },
      statusi: { type: DataTypes.STRING, allowNull: false }
    },
    { sequelize, modelName: 'Notification', tableName: 'Notifications', timestamps: false }
  );
  return Notification;
};
