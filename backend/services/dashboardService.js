"use strict";

const { Op } = require("sequelize");
const db = require("../models");

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTimeRange(start, end) {
  const fmt = (v) => {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const a = fmt(start);
  const b = fmt(end);
  if (a && b) return `${a} - ${b}`;
  return a || b || "";
}

function mapFutureEvent(row) {
  const speakers = row.eventSpeakers || [];
  const firstSpeaker = speakers.find((link) => link.speaker)?.speaker;
  const host = firstSpeaker
    ? `${firstSpeaker.emri} ${firstSpeaker.mbiemri}`.trim()
    : "Event EMS";

  return {
    id: String(row.id),
    title: row.titulli,
    host,
    time: formatTimeRange(row.data_fillimit, row.data_perfundimit),
    location: row.lokacioni || "",
    date: formatDate(row.data_fillimit),
    status: row.publication_status === "published" ? "Published" : "Draft",
  };
}

async function countSoldTicketsFromRegistrations() {
  return db.Registration.count({
    where: { statusi: { [Op.ne]: "cancelled" } },
  });
}

async function countSoldTicketsFromInventory() {
  const tickets = await db.Ticket.findAll({
    include: [
      {
        model: db.Event,
        as: "event",
        attributes: ["kapaciteti"],
      },
    ],
  });

  return tickets.reduce((sum, ticket) => {
    const capacity = Number(ticket.event?.kapaciteti) || 0;
    const available = Number(ticket.sasia_disponueshme) || 0;
    if (capacity > 0) {
      return sum + Math.max(0, capacity - available);
    }
    return sum;
  }, 0);
}

async function calculateIncome() {
  const paid = await db.Payment.sum("shuma", {
    where: { statusi: "completed" },
  });
  const incomeFromPayments = Number(paid) || 0;
  if (incomeFromPayments > 0) {
    return incomeFromPayments;
  }

  const registrations = await db.Registration.findAll({
    where: { statusi: { [Op.ne]: "cancelled" } },
    include: [{ model: db.Ticket, as: "ticket", attributes: ["cmimi"] }],
  });

  return registrations.reduce(
    (sum, row) => sum + Number(row.ticket?.cmimi || 0),
    0,
  );
}

async function getDashboardStats() {
  const now = new Date();

  // Events that have not ended yet (upcoming + in progress)
  const upcomingWhere = { data_perfundimit: { [Op.gte]: now } };

  const futureEvents = await db.Event.findAll({
    where: upcomingWhere,
    include: [
      {
        model: db.EventSpeaker,
        as: "eventSpeakers",
        include: [{ model: db.Speaker, as: "speaker" }],
      },
    ],
    order: [["data_fillimit", "ASC"]],
    limit: 10,
  });

  const futureEventsCount = await db.Event.count({
    where: upcomingWhere,
  });

  const soldFromRegistrations = await countSoldTicketsFromRegistrations();
  const soldFromInventory = await countSoldTicketsFromInventory();
  const soldTickets =
    soldFromRegistrations > 0 ? soldFromRegistrations : soldFromInventory;

  const income = await calculateIncome();

  return {
    futureEventsCount,
    soldTickets,
    income: Math.round(income * 100) / 100,
    futureEvents: futureEvents.map(mapFutureEvent),
  };
}

module.exports = {
  getDashboardStats,
  mapFutureEvent,
};
