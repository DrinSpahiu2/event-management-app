const express = require("express");
const db = require("../models");

const router = express.Router();

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(ora) {
  if (!ora) return "";
  const part = String(ora).slice(0, 5);
  const [h, m] = part.split(":").map(Number);
  if (Number.isNaN(h)) return part;
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${ampm}`;
}

function mapAssignmentStatus(value) {
  if (value === "accepted") return "Accepted";
  if (value === "declined") return "Declined";
  return "Pending";
}

function toSpeakerEvent(link) {
  const ev = link.Event;
  if (!ev) return null;

  return {
    id: String(ev.id),
    assignmentId: link.id,
    title: ev.titulli,
    tema: link.tema,
    host: "Event EMS",
    time: formatTime(link.ora),
    location: ev.lokacioni || "",
    date: formatDate(ev.data_fillimit),
    endDate: formatDate(ev.data_perfundimit),
    status:
      new Date(ev.data_perfundimit) >= new Date() ? "Upcoming" : "Completed",
    assignedBy: "Manager",
    requestedOn: formatDate(link.createdAt),
    attendees: ev.kapaciteti ?? 0,
    rating: 0,
    assignmentStatus: mapAssignmentStatus(link.assignment_status),
    checkedIn: Boolean(link.checked_in),
  };
}

async function findSpeakerByEmail(email) {
  const user = await db.User.findOne({ where: { email } });
  if (user) {
    const [speaker] = await db.Speaker.findOrCreate({
      where: { email },
      defaults: { emri: user.emri, mbiemri: user.mbiemri, email },
    });
    return speaker;
  }
  return db.Speaker.findOne({ where: { email } });
}

router.get("/events", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Email i speaker-it mungon" });
    }

    const speaker = await findSpeakerByEmail(email);
    if (!speaker) {
      return res.json({ upcoming: [], past: [] });
    }

    const links = await db.EventSpeaker.findAll({
      where: { speaker_id: speaker.id },
      include: [{ model: db.Event }],
      order: [[db.Event, "data_fillimit", "DESC"]],
    });

    const now = new Date();
    const upcoming = [];
    const past = [];

    for (const link of links) {
      const item = toSpeakerEvent(link);
      if (!item) continue;
      if (new Date(link.Event.data_perfundimit) >= now) {
        upcoming.push(item);
      } else {
        past.push(item);
      }
    }

    res.json({ upcoming, past });
  } catch (err) {
    console.error("GET /speaker/events:", err.message);
    res.status(500).json({ error: "Nuk u lexuan eventet e speaker-it" });
  }
});

router.patch("/assignments/:id", async (req, res) => {
  try {
    const email = req.body.email;
    const { assignment_status, checked_in } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email i speaker-it mungon" });
    }

    const speaker = await findSpeakerByEmail(email);
    if (!speaker) {
      return res.status(404).json({ error: "Speaker-i nuk u gjet" });
    }

    const link = await db.EventSpeaker.findByPk(Number(req.params.id), {
      include: [{ model: db.Event }],
    });
    if (!link || Number(link.speaker_id) !== Number(speaker.id)) {
      return res.status(404).json({ error: "Caktimi nuk u gjet" });
    }

    if (assignment_status) {
      const allowed = ["pending", "accepted", "declined"];
      if (!allowed.includes(assignment_status)) {
        return res.status(400).json({ error: "Statusi nuk është valide" });
      }
      link.assignment_status = assignment_status;
    }

    if (checked_in !== undefined) {
      if (link.assignment_status !== "accepted") {
        return res
          .status(400)
          .json({ error: "Check-in vetëm pas pranimit të caktimit" });
      }
      link.checked_in = Boolean(checked_in);
    }

    await link.save();

    res.json(toSpeakerEvent(link));
  } catch (err) {
    console.error("PATCH /speaker/assignments:", err.message);
    res.status(500).json({ error: "Nuk u përditësua caktimi" });
  }
});

module.exports = router;
