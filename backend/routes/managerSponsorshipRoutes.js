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

function mapStatusLabel(status) {
  if (status === "accepted") return "Accepted";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function mapManagerRequest(link) {
  const sponsor = link.sponsor;
  const event = link.event;
  return {
    id: link.id,
    status: link.status || "pending",
    statusLabel: mapStatusLabel(link.status),
    eventId: String(link.event_id),
    eventTitle: event?.titulli || "Untitled event",
    eventDate: formatDate(event?.data_fillimit),
    eventLocation: event?.lokacioni || "",
    companyName: sponsor?.emertimi || "",
    email: sponsor?.email || "",
    website: sponsor?.website || "",
    tier: link.niveli_sponsorizimit || sponsor?.niveli_sponsorizimit || "",
    budget: Number(link.shuma),
    message: sponsor?.mesazhi || "",
    submittedAt: link.createdAt,
  };
}

router.get("/", async (req, res) => {
  try {
    const status = req.query.status;
    const where = {};
    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      where.status = status;
    }

    const rows = await db.EventSponsor.findAll({
      where,
      include: [
        { model: db.Sponsor, as: "sponsor" },
        { model: db.Event, as: "event" },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(rows.map(mapManagerRequest));
  } catch (err) {
    console.error("GET /api/manager/sponsorships:", err.message);
    res.status(500).json({ error: "Failed to load sponsorship requests" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "accepted", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        error: "Status must be pending, accepted, or rejected",
      });
    }

    const link = await db.EventSponsor.findByPk(req.params.id, {
      include: [
        { model: db.Sponsor, as: "sponsor" },
        { model: db.Event, as: "event" },
      ],
    });

    if (!link) {
      return res.status(404).json({ error: "Sponsorship request not found" });
    }

    link.status = status;
    await link.save();
    await link.reload({
      include: [
        { model: db.Sponsor, as: "sponsor" },
        { model: db.Event, as: "event" },
      ],
    });

    const label =
      status === "accepted"
        ? "accepted"
        : status === "rejected"
          ? "rejected"
          : "reset to pending";

    res.json({
      message: `Sponsorship request ${label}`,
      request: mapManagerRequest(link),
    });
  } catch (err) {
    console.error("PATCH /api/manager/sponsorships/:id/status:", err.message);
    res.status(500).json({ error: "Failed to update sponsorship status" });
  }
});

module.exports = router;
