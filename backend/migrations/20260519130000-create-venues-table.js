'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Venues', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      emri: {
        type: Sequelize.STRING,
        allowNull: false
      },

      adresa: {
        type: Sequelize.STRING,
        allowNull: false
      },

      qyteti: {
        type: Sequelize.STRING,
        allowNull: false
      },

      kapaciteti: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Venues');
  }
};
