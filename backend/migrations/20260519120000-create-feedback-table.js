'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Feedback', {
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

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      vleresimi: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      komenti: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      data: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Feedback');
  }
};
