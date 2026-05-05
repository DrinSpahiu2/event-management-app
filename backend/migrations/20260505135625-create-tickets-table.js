module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      event_id: {
        type: Sequelize.INTEGER
      },
      lloji: {
        type: Sequelize.STRING
      },
      cmimi: {
        type: Sequelize.DECIMAL(10,2)
      },
      sasia_disponueshme: {
        type: Sequelize.INTEGER
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tickets');
  }
};