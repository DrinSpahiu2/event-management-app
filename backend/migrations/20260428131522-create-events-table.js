'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      titulli: { type: Sequelize.STRING, allowNull: false },
      pershkrimi: { type: Sequelize.TEXT },
      data_fillimit: { type: Sequelize.DATE, allowNull: false },
      data_perfundimit: { type: Sequelize.DATE, allowNull: false },
      lokacioni: { type: Sequelize.STRING },
      kapaciteti: { type: Sequelize.INTEGER },
      statusi: { type: Sequelize.ENUM('aktiv', 'anuluar', 'perfunduar'), defaultValue: 'aktiv' },
      organizer_id: { type: Sequelize.INTEGER },
      imazhi: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('Events'); }
};