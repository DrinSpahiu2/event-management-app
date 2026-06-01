"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Sponsors", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Sponsors", "mesazhi", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Sponsors", "mesazhi");
    await queryInterface.removeColumn("Sponsors", "email");
  },
};
