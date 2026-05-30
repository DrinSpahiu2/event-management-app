"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Events", "venue_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "Venues", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("coupons", "event_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "Events", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Certificates", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_certificates_user_id",
      references: { table: "Users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Certificates", {
      fields: ["event_id"],
      type: "foreign key",
      name: "fk_certificates_event_id",
      references: { table: "Events", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Agenda", {
      fields: ["event_id"],
      type: "foreign key",
      name: "fk_agenda_event_id",
      references: { table: "Events", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("Notifications", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_notifications_user_id",
      references: { table: "Users", field: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "Notifications",
      "fk_notifications_user_id",
    );
    await queryInterface.removeConstraint("Agenda", "fk_agenda_event_id");
    await queryInterface.removeConstraint(
      "Certificates",
      "fk_certificates_event_id",
    );
    await queryInterface.removeConstraint(
      "Certificates",
      "fk_certificates_user_id",
    );
    await queryInterface.removeColumn("coupons", "event_id");
    await queryInterface.removeColumn("Events", "venue_id");
  },
};
