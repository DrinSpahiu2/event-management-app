'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventSpeakers', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      event_id: { type: Sequelize.INTEGER, allowNull: false },
      speaker_id: { type: Sequelize.INTEGER, allowNull: false },
      tema: { type: Sequelize.STRING, allowNull: false },
      ora: { type: Sequelize.TIME, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('EventSpeakers'); }
};

