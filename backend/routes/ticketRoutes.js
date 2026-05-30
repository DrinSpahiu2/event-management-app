"use strict";

const express = require("express");
const router = express.Router();
const db = require("../models");
const { mapTicket } = require("../services/ticketService");

const eventInclude = {
  model: db.Event,
  as: "event",
  attributes: ["id", "titulli", "lokacioni", "data_fillimit"],
};

// READ — të gjitha biletat (opsional: ?event_id=1)
router.get("/", async (req, res) => {
  try {
    const where = {};
    if (req.query.event_id) {
      where.event_id = Number(req.query.event_id);
    }

    const rows = await db.Ticket.findAll({
      where,
      include: [eventInclude],
      order: [["id", "DESC"]],
    });
    res.json(rows.map(mapTicket));
  } catch (error) {
    console.error("GET /api/tickets:", error.message);
    res.status(500).json({ message: "Nuk u lexuan biletat." });
  }
});

// READ — biletat sipas ngjarjes
router.get("/event/:eventId", async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const event = await db.Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Ngjarja nuk u gjet." });
    }

    const rows = await db.Ticket.findAll({
      where: { event_id: eventId },
      include: [eventInclude],
      order: [["id", "ASC"]],
    });
    res.json(rows.map(mapTicket));
  } catch (error) {
    console.error("GET /api/tickets/event/:eventId:", error.message);
    res.status(500).json({ message: "Nuk u lexuan biletat e ngjarjes." });
  }
});

// READ — një biletë
router.get("/:id", async (req, res) => {
  try {
    const row = await db.Ticket.findByPk(req.params.id, {
      include: [eventInclude],
    });
    if (!row) {
      return res.status(404).json({ message: "Bileta nuk u gjet." });
    }
    res.json(mapTicket(row));
  } catch (error) {
    console.error("GET /api/tickets/:id:", error.message);
    res.status(500).json({ message: "Gabim në leximin e biletës." });
  }
});

// CREATE — krijo biletë + vendos çmimin
router.post("/", async (req, res) => {
  try {
    const { event_id, lloji, cmimi, sasia_disponueshme } = req.body;

    if (!event_id) {
      return res.status(400).json({ message: "event_id është i detyrueshëm." });
    }
    if (cmimi == null || cmimi === "") {
      return res.status(400).json({ message: "Çmimi i biletës (cmimi) është i detyrueshëm." });
    }

    const event = await db.Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Ngjarja nuk u gjet." });
    }

    const row = await db.Ticket.create({
      event_id: Number(event_id),
      lloji: lloji || "Standard",
      cmimi: Number(cmimi),
      sasia_disponueshme:
        sasia_disponueshme != null && sasia_disponueshme !== ""
          ? Number(sasia_disponueshme)
          : event.kapaciteti || 0,
    });

    const full = await db.Ticket.findByPk(row.id, { include: [eventInclude] });
    res.status(201).json(mapTicket(full));
  } catch (error) {
    console.error("POST /api/tickets:", error.message);
    res.status(400).json({ message: "Bileta nuk u krijua." });
  }
});

// UPDATE — përditëso biletën (lloji, çmimi, sasia)
router.put("/:id", async (req, res) => {
  try {
    const row = await db.Ticket.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ message: "Bileta nuk u gjet." });
    }

    const { lloji, cmimi, sasia_disponueshme, event_id } = req.body;

    if (event_id !== undefined) row.event_id = Number(event_id);
    if (lloji !== undefined) row.lloji = lloji;
    if (cmimi !== undefined) row.cmimi = Number(cmimi);
    if (sasia_disponueshme !== undefined) {
      row.sasia_disponueshme = Number(sasia_disponueshme);
    }

    await row.save();

    const full = await db.Ticket.findByPk(row.id, { include: [eventInclude] });
    res.json(mapTicket(full));
  } catch (error) {
    console.error("PUT /api/tickets/:id:", error.message);
    res.status(400).json({ message: "Bileta nuk u përditësua." });
  }
});

// UPDATE — përditëso vetëm sasinë
router.patch("/:id/quantity", async (req, res) => {
  try {
    const row = await db.Ticket.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ message: "Bileta nuk u gjet." });
    }

    const { sasia_disponueshme } = req.body;
    if (sasia_disponueshme == null || sasia_disponueshme === "") {
      return res
        .status(400)
        .json({ message: "sasia_disponueshme është e detyrueshme." });
    }

    row.sasia_disponueshme = Number(sasia_disponueshme);
    await row.save();

    const full = await db.Ticket.findByPk(row.id, { include: [eventInclude] });
    res.json(mapTicket(full));
  } catch (error) {
    console.error("PATCH /api/tickets/:id/quantity:", error.message);
    res.status(400).json({ message: "Sasia nuk u përditësua." });
  }
});

// DELETE — fshi biletën
router.delete("/:id", async (req, res) => {
  try {
    const row = await db.Ticket.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ message: "Bileta nuk u gjet." });
    }

    await row.destroy();
    res.json({ message: "Bileta u fshi me sukses." });
  } catch (error) {
    console.error("DELETE /api/tickets/:id:", error.message);
    res.status(500).json({ message: "Fshirja e biletës dështoi." });
  }
});

module.exports = router;
