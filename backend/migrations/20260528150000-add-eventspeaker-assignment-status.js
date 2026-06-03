"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make this migration idempotent: if columns already exist, don't fail.
    const tableDefinition = await queryInterface.describeTable("EventSpeakers");

    if (!tableDefinition.assignment_status) {
      await queryInterface.addColumn("EventSpeakers", "assignment_status", {
        type: Sequelize.ENUM("pending", "accepted", "declined"),
        allowNull: false,
        defaultValue: "pending",
      });
    }

    if (!tableDefinition.checked_in) {
      await queryInterface.addColumn("EventSpeakers", "checked_in", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface) {
    const tableDefinition = await queryInterface.describeTable("EventSpeakers");

    if (tableDefinition.checked_in) {
      await queryInterface.removeColumn("EventSpeakers", "checked_in");
    }

    if (tableDefinition.assignment_status) {
      await queryInterface.removeColumn("EventSpeakers", "assignment_status");
    }
  },
};

