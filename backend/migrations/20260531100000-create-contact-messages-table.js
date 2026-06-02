"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ContactMessages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      emri: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      subjekti: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mesazhi: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      statusi: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      pergjigja: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      data_dergimit: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      data_pergjigjes: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ContactMessages");
  },
};
