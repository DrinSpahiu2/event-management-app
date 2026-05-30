"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the current columns of the table
    const tableDefinition =
      await queryInterface.describeTable("EventCategories");

    // Only add createdAt if it doesn't exist yet
    if (!tableDefinition.createdAt) {
      await queryInterface.addColumn("EventCategories", "createdAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }

    // Only add updatedAt if it doesn't exist yet
    if (!tableDefinition.updatedAt) {
      await queryInterface.addColumn("EventCategories", "updatedAt", {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      });
    }
  },

  async down(queryInterface) {
    const tableDefinition =
      await queryInterface.describeTable("EventCategories");

    if (tableDefinition.updatedAt) {
      await queryInterface.removeColumn("EventCategories", "updatedAt");
    }
    if (tableDefinition.createdAt) {
      await queryInterface.removeColumn("EventCategories", "createdAt");
    }
  },
};
