"use strict";

const db = require("../models");

/**
 * Krijon biletën fillestare kur krijohet një ngjarje.
 * Sasia vjen nga kapaciteti i eventit nëse nuk jepet veçmas.
 */
async function createDefaultTicketForEvent(event, options = {}) {
  const kapaciteti = event.kapaciteti ?? 0;
  const sasia =
    options.sasia_disponueshme != null && options.sasia_disponueshme !== ""
      ? Number(options.sasia_disponueshme)
      : kapaciteti > 0
        ? kapaciteti
        : 100;

  const cmimi =
    options.cmimi != null && options.cmimi !== ""
      ? Number(options.cmimi)
      : 0;

  return db.Ticket.create({
    event_id: event.id,
    lloji: options.lloji || "Standard",
    cmimi,
    sasia_disponueshme: sasia,
  });
}

function mapTicket(row) {
  const event = row.event;
  return {
    id: row.id,
    event_id: row.event_id,
    event_name: event ? event.titulli : null,
    lloji: row.lloji,
    cmimi: row.cmimi != null ? Number(row.cmimi) : 0,
    sasia_disponueshme: row.sasia_disponueshme,
  };
}

module.exports = {
  createDefaultTicketForEvent,
  mapTicket,
};
