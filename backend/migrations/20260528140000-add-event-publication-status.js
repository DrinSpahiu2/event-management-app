"use strict";

/** Draft / Published — si në dashboard-in e menaxherit */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Events", "publication_status", {
      type: Sequelize.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Events", "publication_status");
  },
};
