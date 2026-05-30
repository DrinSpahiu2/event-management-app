"use strict";

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models");

const ACTIVE_STATUSES = ["confirmed", "pending"];

function mapRegistration(row) {
  const event = row.event;
  const ticket = row.ticket;
  return {
    id: row.id,
    eventId: row.event_id,
    ticketId: row.ticket_id,
    status: row.statusi,
    purchaseDate: row.data_regjistrimit,
    eventTitle: event?.titulli || "Event",
    eventDate: event?.data_fillimit || null,
    location: event?.lokacioni || "",
    ticketType: ticket?.lloji || "Standard",
    price: ticket?.cmimi != null ? Number(ticket.cmimi) : 0,
    image: event?.imazhi || null,
  };
}

// READ — biletat e blera nga përdoruesi
router.get("/me", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId është i detyrueshëm." });
    }

    const rows = await db.Registration.findAll({
      where: { user_id: userId },
      include: [
        { model: db.Event, as: "event" },
        { model: db.Ticket, as: "ticket" },
      ],
      order: [["data_regjistrimit", "DESC"]],
    });

    res.json(rows.map(mapRegistration));
  } catch (err) {
    console.error("GET /api/registrations/me:", err.message);
    res.status(500).json({ error: "Nuk u lexuan biletat e blera." });
  }
});

// READ — a ka përdoruesi blerë tashmë për këtë event?
router.get("/check", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const eventId = Number(req.query.eventId);

    if (!userId || !eventId) {
      return res.status(400).json({ error: "userId dhe eventId janë të detyrueshëm." });
    }

    const existing = await db.Registration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        statusi: { [Op.in]: ACTIVE_STATUSES },
      },
    });

    res.json({ purchased: Boolean(existing) });
  } catch (err) {
    console.error("GET /api/registrations/check:", err.message);
    res.status(500).json({ error: "Kontrolli dështoi." });
  }
});

// READ — ID të eventeve ku përdoruesi ka biletë aktive
router.get("/me/event-ids", async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId është i detyrueshëm." });
    }

    const rows = await db.Registration.findAll({
      where: {
        user_id: userId,
        statusi: { [Op.in]: ACTIVE_STATUSES },
      },
      attributes: ["event_id"],
    });

    res.json([...new Set(rows.map((r) => r.event_id))]);
  } catch (err) {
    console.error("GET /api/registrations/me/event-ids:", err.message);
    res.status(500).json({ error: "Nuk u lexuan blerjet." });
  }
});

// CREATE — blerje biletë (checkout)
router.post("/purchase", async (req, res) => {
  try {
    const { userId, eventId, ticketId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ error: "userId dhe eventId janë të detyrueshëm." });
    }

    const user = await db.User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "Përdoruesi nuk u gjet." });

    const event = await db.Event.findByPk(eventId);
    if (!event) return res.status(404).json({ error: "Ngjarja nuk u gjet." });

    let ticket;
    if (ticketId) {
      ticket = await db.Ticket.findOne({
        where: { id: ticketId, event_id: eventId },
      });
    } else {
      ticket = await db.Ticket.findOne({
        where: { event_id: eventId },
        order: [["id", "ASC"]],
      });
    }

    if (!ticket) {
      return res.status(404).json({ error: "Nuk ka biletë për këtë ngjarje." });
    }

    if (ticket.sasia_disponueshme <= 0) {
      return res.status(400).json({ error: "Biletat janë shitur." });
    }

    const alreadyOwned = await db.Registration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
        statusi: { [Op.in]: ACTIVE_STATUSES },
      },
    });

    if (alreadyOwned) {
      return res.status(409).json({
        error: "Ke blerë tashmë një biletë për këtë ngjarje. Shiko te My Tickets.",
      });
    }

    const registration = await db.Registration.create({
      event_id: eventId,
      user_id: userId,
      ticket_id: ticket.id,
      data_regjistrimit: new Date(),
      statusi: "confirmed",
    });

    ticket.sasia_disponueshme -= 1;
    await ticket.save();

    await db.Payment.create({
      registration_id: registration.id,
      shuma: ticket.cmimi,
      metoda: "card",
      data: new Date(),
      statusi: "completed",
    });

    const full = await db.Registration.findByPk(registration.id, {
      include: [
        { model: db.Event, as: "event" },
        { model: db.Ticket, as: "ticket" },
      ],
    });

    res.status(201).json(mapRegistration(full));
  } catch (err) {
    console.error("POST /api/registrations/purchase:", err.message);
    res.status(500).json({ error: "Blerja e biletës dështoi." });
  }
});

module.exports = router;
