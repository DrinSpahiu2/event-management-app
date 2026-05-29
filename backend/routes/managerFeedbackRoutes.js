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

function toManagerFeedback(row) {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    userId: String(row.user_id),
    rating: row.vleresimi,
    comment: row.komenti || "",
    date: formatDate(row.data),
    eventTitle: row.event?.titulli || "",
    eventLocation: row.event?.lokacioni || "",
    userName: row.user ? `${row.user.emri} ${row.user.mbiemri}`.trim() : "",
    userEmail: row.user?.email || "",
  };
}

router.get("/", async (req, res) => {
  try {
    const rows = await db.Feedback.findAll({
      include: [
        { model: db.Event, as: "event", attributes: ["id", "titulli", "lokacioni"] },
        { model: db.User, as: "user", attributes: ["id", "emri", "mbiemri", "email"] },
      ],
      order: [["data", "DESC"]],
    });

    res.json(rows.map(toManagerFeedback));
  } catch (err) {
    console.error("GET /manager/feedback:", err.message);
    res.status(500).json({ error: "Nuk u lexuan feedback-et" });
  }
});

module.exports = router;
