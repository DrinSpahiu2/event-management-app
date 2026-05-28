'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    static associate(models) {
      Coupon.belongsTo(models.Event, { foreignKey: 'event_id', as: 'event' });
    }
  }
  Coupon.init(
    {
      code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false
      },
      discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      event_id: { type: DataTypes.INTEGER, allowNull: true }
    },
    { sequelize, modelName: 'Coupon', tableName: 'coupons', timestamps: false }
  );
  return Coupon;
};
