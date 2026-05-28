const express = require("express");
const db = require("../models");

const router = express.Router();

const eventInclude = [
  {
    model: db.EventSpeaker,
    include: [{ model: db.Speaker }],
  },
];

function mapSpeakers(row) {
  return (row.EventSpeakers || []).map((link) => ({
    id: link.Speaker?.id,
    name: link.Speaker ? `${link.Speaker.emri} ${link.Speaker.mbiemri}` : "",
    tema: link.tema,
    ora: link.ora,
  }));
}

function toEvent(row) {
  const d = row.data_fillimit ? new Date(row.data_fillimit) : null;
  const date =
    d && !Number.isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "";
  return {
    id: String(row.id),
    name: row.titulli,
    date,
    venue: row.lokacioni || "",
    status: row.publication_status === "published" ? "Published" : "Draft",
    speakers: mapSpeakers(row),
  };
}

async function listSpeakersForManager() {
  const speakerType = await db.UserType.findOne({ where: { emri: "Speaker" } });
  if (!speakerType) {
    const rows = await db.Speaker.findAll({ order: [["emri", "ASC"]] });
    return rows.map((s) => ({
      id: s.id,
      name: `${s.emri} ${s.mbiemri}`,
      email: s.email,
    }));
  }

  const users = await db.User.findAll({
    where: { user_type_id: speakerType.id, statusi: "aktiv" },
    attributes: ["emri", "mbiemri", "email"],
    order: [["emri", "ASC"]],
  });

  const result = [];
  for (const u of users) {
    const [sp] = await db.Speaker.findOrCreate({
      where: { email: u.email },
      defaults: { emri: u.emri, mbiemri: u.mbiemri, email: u.email },
    });
    result.push({
      id: sp.id,
      name: `${sp.emri} ${sp.mbiemri}`,
      email: sp.email,
    });
  }
  return result;
}

router.get("/speakers", async (req, res) => {
  try {
    res.json(await listSpeakersForManager());
  } catch (err) {
    console.error("GET /speakers:", err.message);
    res.status(500).json({ error: "Nuk u lexuan speakerët" });
  }
});

router.get("/events", async (req, res) => {
  try {
    const rows = await db.Event.findAll({
      order: [["data_fillimit", "DESC"]],
      include: eventInclude,
    });
    res.json(rows.map(toEvent));
  } catch (err) {
    console.error("GET /events:", err.message);
    res.status(500).json({ error: "Nuk u lexuan eventet" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const {
      titulli,
      pershkrimi,
      data_fillimit,
      data_perfundimit,
      lokacioni,
      kapaciteti,
      statusi,
      publication_status,
      organizer_id,
      imazhi,
      speaker_id,
      tema,
      ora,
    } = req.body;

    if (!titulli || !data_fillimit || !data_perfundimit || !lokacioni) {
      return res
        .status(400)
        .json({ error: "Plotëso titullin, datat dhe lokacionin" });
    }

    if (speaker_id && (!tema || !ora)) {
      return res
        .status(400)
        .json({ error: "Për speaker-in plotëso temën dhe orën" });
    }

    const start = new Date(data_fillimit);
    const end = new Date(data_perfundimit);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ error: "Datat nuk janë valide" });
    }

    const row = await db.Event.create({
      titulli,
      pershkrimi: pershkrimi || null,
      data_fillimit: start,
      data_perfundimit: end,
      lokacioni,
      kapaciteti:
        kapaciteti != null && kapaciteti !== "" ? Number(kapaciteti) : null,
      statusi: statusi || "aktiv",
      publication_status: publication_status || "draft",
      organizer_id: organizer_id || null,
      imazhi: imazhi || null,
    });

    if (speaker_id) {
      const speaker = await db.Speaker.findByPk(speaker_id);
      if (!speaker) {
        return res.status(400).json({ error: "Speaker-i nuk u gjet" });
      }
      await db.EventSpeaker.create({
        event_id: row.id,
        speaker_id,
        tema,
        ora,
      });
    }

    const full = await db.Event.findByPk(row.id, { include: eventInclude });
    res.status(201).json(toEvent(full));
  } catch (err) {
    console.error("POST /events:", err.message);
    res.status(500).json({ error: "Nuk u krijua eventi" });
  }
});

router.patch("/events/:id/toggle", async (req, res) => {
  try {
    const row = await db.Event.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Eventi nuk u gjet" });

    row.publication_status =
      row.publication_status === "published" ? "draft" : "published";
    await row.save();

    const full = await db.Event.findByPk(row.id, { include: eventInclude });
    res.json(toEvent(full));
  } catch (err) {
    console.error("PATCH toggle:", err.message);
    res.status(500).json({ error: "Nuk u ndryshua statusi" });
  }
});

module.exports = router;
