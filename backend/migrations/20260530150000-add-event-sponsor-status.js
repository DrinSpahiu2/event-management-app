"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("EventSponsors", "status", {
      type: Sequelize.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    });

    await queryInterface.sequelize.query(
      "UPDATE EventSponsors SET status = 'accepted'",
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("EventSponsors", "status");
  },
};
