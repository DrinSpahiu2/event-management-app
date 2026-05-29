"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EventCategory extends Model {
    static associate() {
      // Events.category_id nuk ekziston në DB — lidhja shtohet kur të ketë migrim
    }
  }
  EventCategory.init(
    {
      emertimi: { type: DataTypes.STRING, allowNull: false, unique: true },
      pershkrimi: DataTypes.TEXT,
    },
    { sequelize, modelName: "EventCategory", tableName: "EventCategories" },
  );
  return EventCategory;
};
