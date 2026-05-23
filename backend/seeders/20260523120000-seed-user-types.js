"use strict";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("UserTypes", [
      {
        emri: "SuperAdmin",
        pershkrimi: "Administrator i plotë i sistemit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emri: "Manager",
        pershkrimi: "Menaxheri i eventeve",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emri: "Speaker",
        pershkrimi: "Folësi në eventet",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emri: "Sponsor",
        pershkrimi: "Sponsor i eventeve",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        emri: "Client",
        pershkrimi: "Klient/Pjesëmarrës në eventet",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("UserTypes", null, {});
  },
};
