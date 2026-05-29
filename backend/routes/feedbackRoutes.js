const express = require("express");
const db = require("../models");

const router = express.Router();

const feedbackInclude = [
  { model: db.Event, as: "event", attributes: ["id", "titulli", "lokacioni"] },
  { model: db.User, as: "user", attributes: ["id", "emri", "mbiemri", "email"] },
];

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function toFeedback(row) {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    userId: String(row.user_id),
    rating: row.vleresimi,
    comment: row.komenti || "",
    date: formatDate(row.data),
    dateRaw: row.data,
    eventTitle: row.event?.titulli || "",
    eventLocation: row.event?.lokacioni || "",
    userName: row.user ? `${row.user.emri} ${row.user.mbiemri}`.trim() : "",
    userEmail: row.user?.email || "",
  };
}

function parseUserId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseRating(value) {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

router.get("/", async (req, res) => {
  try {
    const userId = parseUserId(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId mungon" });
    }

    const rows = await db.Feedback.findAll({
      where: { user_id: userId },
      include: feedbackInclude,
      order: [["data", "DESC"]],
    });

    res.json(rows.map(toFeedback));
  } catch (err) {
    console.error("GET /feedback:", err.message);
    res.status(500).json({ error: "Nuk u lexuan feedback-et" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = parseUserId(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId mungon" });
    }

    const row = await db.Feedback.findByPk(Number(req.params.id), {
      include: feedbackInclude,
    });
    if (!row || Number(row.user_id) !== userId) {
      return res.status(404).json({ error: "Feedback-u nuk u gjet" });
    }

    res.json(toFeedback(row));
  } catch (err) {
    console.error("GET /feedback/:id:", err.message);
    res.status(500).json({ error: "Nuk u lexua feedback-u" });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = parseUserId(req.body.userId);
    const eventId = Number(req.body.event_id);
    const rating = parseRating(req.body.vleresimi);
    const komenti = req.body.komenti?.trim() || null;

    if (!userId) {
      return res.status(400).json({ error: "userId mungon" });
    }
    if (!eventId) {
      return res.status(400).json({ error: "Eventi mungon" });
    }
    if (rating === null) {
      return res.status(400).json({ error: "Vlerësimi duhet të jetë 1–5" });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Përdoruesi nuk u gjet" });
    }

    const event = await db.Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: "Eventi nuk u gjet" });
    }

    const row = await db.Feedback.create({
      user_id: userId,
      event_id: eventId,
      vleresimi: rating,
      komenti,
      data: new Date(),
    });

    const withRelations = await db.Feedback.findByPk(row.id, {
      include: feedbackInclude,
    });

    res.status(201).json(toFeedback(withRelations));
  } catch (err) {
    console.error("POST /feedback:", err.message);
    res.status(500).json({ error: "Nuk u krijua feedback-u" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const userId = parseUserId(req.body.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId mungon" });
    }

    const row = await db.Feedback.findByPk(Number(req.params.id));
    if (!row || Number(row.user_id) !== userId) {
      return res.status(404).json({ error: "Feedback-u nuk u gjet" });
    }

    if (req.body.vleresimi !== undefined) {
      const rating = parseRating(req.body.vleresimi);
      if (rating === null) {
        return res.status(400).json({ error: "Vlerësimi duhet të jetë 1–5" });
      }
      row.vleresimi = rating;
    }

    if (req.body.komenti !== undefined) {
      row.komenti = req.body.komenti?.trim() || null;
    }

    await row.save();

    const withRelations = await db.Feedback.findByPk(row.id, {
      include: feedbackInclude,
    });

    res.json(toFeedback(withRelations));
  } catch (err) {
    console.error("PATCH /feedback/:id:", err.message);
    res.status(500).json({ error: "Nuk u përditësua feedback-u" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = parseUserId(req.query.userId || req.body.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId mungon" });
    }

    const row = await db.Feedback.findByPk(Number(req.params.id));
    if (!row || Number(row.user_id) !== userId) {
      return res.status(404).json({ error: "Feedback-u nuk u gjet" });
    }

    await row.destroy();
    res.json({ message: "Feedback-u u fshi" });
  } catch (err) {
    console.error("DELETE /feedback/:id:", err.message);
    res.status(500).json({ error: "Nuk u fshi feedback-u" });
  }
});

module.exports = router;
