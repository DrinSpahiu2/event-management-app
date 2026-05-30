"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("EventSponsors", "niveli_sponsorizimit", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("EventSponsors", "niveli_sponsorizimit");
  },
};
