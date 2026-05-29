const express = require("express");
const db = require("../models");

const router = express.Router();

function toUi(item) {
  return {
    id: item.id,
    event: item.event?.titulli || "",
    slot: item.slot || "",
    session: item.title,
    speaker: item.speakerName || "",
  };
}

router.get("/", async (req, res) => {
  try {
    const rows = await db.Agenda.findAll({
      include: [{ model: db.Event, as: "event" }],
      order: [["start_time", "ASC"]],
    });

    res.json(
      rows.map((r) => ({
        id: r.id,
        event: r.event?.titulli || "",
        slot: "",
        session: r.title,
        speaker: "",
        title: r.title,
        start_time: r.start_time,
        end_time: r.end_time,
        event_id: r.event_id,
      }))
    );
  } catch (err) {
    console.error("GET /api/manager/schedule", err.message);
    res.status(500).json({ error: "Nuk u lexua agjenda" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { event, session, start_time, end_time } = req.body;
    // Our current UI collects: event, slot, session, speaker.
    // For DB we need: event_id, title, start_time, end_time.

    if (!event || !session || !start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "Plotëso: event, session, start_time, end_time" });
    }

    const evRow = await db.Event.findOne({ where: { titulli: event } });
    if (!evRow) return res.status(400).json({ error: "Event nuk u gjet" });

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ error: "Koha nuk është valide" });
    }

    const agenda = await db.Agenda.create({
      event_id: evRow.id,
      title: session,
      start_time: start,
      end_time: end,
    });

    res.status(201).json(agenda);
  } catch (err) {
    console.error("POST /api/manager/schedule", err.message);
    res.status(500).json({ error: "Nuk u krijua agjenda" });
  }
});

module.exports = router;

