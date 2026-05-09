'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EventSponsors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      sponsor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      shuma: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EventSponsors');
  }
};