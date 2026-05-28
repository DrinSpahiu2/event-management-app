"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("EventSpeakers", "assignment_status", {
      type: Sequelize.ENUM("pending", "accepted", "declined"),
      allowNull: false,
      defaultValue: "pending",
    });
    await queryInterface.addColumn("EventSpeakers", "checked_in", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("EventSpeakers", "checked_in");
    await queryInterface.removeColumn("EventSpeakers", "assignment_status");
  },
};
