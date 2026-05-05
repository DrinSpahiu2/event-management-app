'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Speakers', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      emri: { type: Sequelize.STRING, allowNull: false },
      mbiemri: { type: Sequelize.STRING, allowNull: false },
      biografia: { type: Sequelize.TEXT },
      imazhi: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('Speakers'); }
};
