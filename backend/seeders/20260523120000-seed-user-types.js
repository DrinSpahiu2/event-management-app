"use strict";

const USER_TYPES = [
  {
    emri: "SuperAdmin",
    pershkrimi: "Administrator i plotë i sistemit",
  },
  {
    emri: "Manager",
    pershkrimi: "Menaxheri i eventeve",
  },
  {
    emri: "Speaker",
    pershkrimi: "Folësi në eventet",
  },
  {
    emri: "Sponsor",
    pershkrimi: "Sponsor i eventeve",
  },
  {
    emri: "Client",
    pershkrimi: "Klient/Pjesëmarrës në eventet",
  },
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const rows = USER_TYPES.map((row) => ({
      ...row,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert("UserTypes", rows, {
      ignoreDuplicates: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("UserTypes", null, {});
  },
};
