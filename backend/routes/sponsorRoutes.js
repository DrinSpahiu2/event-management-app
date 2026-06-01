const express = require("express");
const { Op } = require("sequelize");
const db = require("../models");

const router = express.Router();

const TIER_LABELS = {
  starter: "Starter",
  growth: "Growth",
  headline: "Headline",
};

const TIER_IDS_BY_LABEL = {
  Starter: "starter",
  Growth: "growth",
  Headline: "headline",
};

function tierIdFromLabel(label) {
  return TIER_IDS_BY_LABEL[label] || "starter";
}

function mapRequest(link, sponsor) {
  const tier = link.niveli_sponsorizimit || sponsor.niveli_sponsorizimit || "";
  return {
    id: link.id,
    eventId: String(link.event_id),
    eventTitle: link.event?.titulli || "Untitled event",
    eventDate: formatDate(link.event?.data_fillimit),
    eventLocation: link.event?.lokacioni || "",
    tier,
    tierId: tierIdFromLabel(tier),
    budget: Number(link.shuma),
    companyName: sponsor.emertimi,
    email: sponsor.email || "",
    website: sponsor.website || "",
    message: sponsor.mesazhi || "",
    status: link.status || "pending",
    statusLabel:
      link.status === "accepted"
        ? "Accepted"
        : link.status === "rejected"
          ? "Rejected"
          : "Pending",
    submittedAt: link.createdAt,
  };
}

async function findOwnedRequest(requestId, email) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalizedEmail) return null;

  const sponsor = await db.Sponsor.findOne({ where: { email: normalizedEmail } });
  if (!sponsor) return null;

  const link = await db.EventSponsor.findByPk(Number(requestId), {
    include: [{ model: db.Event, as: "event" }],
  });
  if (!link || link.sponsor_id !== sponsor.id) return null;

  return { link, sponsor };
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTimeRange(start, end) {
  const a = formatTime(start);
  const b = formatTime(end);
  if (a && b) return `${a} - ${b}`;
  return a || b || "";
}

function toSponsorEvent(row) {
  return {
    id: String(row.id),
    title: row.titulli || "Untitled event",
    date: formatDate(row.data_fillimit),
    time: formatTimeRange(row.data_fillimit, row.data_perfundimit),
    startAt: row.data_fillimit,
    endAt: row.data_perfundimit,
    location: row.lokacioni || "",
    attendees: row.kapaciteti ?? 0,
    audience: [],
  };
}

function publishedEventWhere() {
  return {
    publication_status: "published",
    statusi: { [Op.ne]: "anuluar" },
  };
}

router.get("/events", async (req, res) => {
  try {
    const rows = await db.Event.findAll({
      where: publishedEventWhere(),
      order: [["data_fillimit", "ASC"]],
    });
    res.json(rows.map(toSponsorEvent));
  } catch (err) {
    console.error("GET /api/sponsor/events:", err.message);
    res.status(500).json({ error: "Failed to load events" });
  }
});

router.get("/requests", async (req, res) => {
  try {
    const email = String(req.query.email || "")
      .trim()
      .toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const sponsor = await db.Sponsor.findOne({ where: { email } });
    if (!sponsor) {
      return res.json([]);
    }

    const links = await db.EventSponsor.findAll({
      where: { sponsor_id: sponsor.id },
      include: [{ model: db.Event, as: "event" }],
      order: [["createdAt", "DESC"]],
    });

    res.json(links.map((link) => mapRequest(link, sponsor)));
  } catch (err) {
    console.error("GET /api/sponsor/requests:", err.message);
    res.status(500).json({ error: "Failed to load sponsorship requests" });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    const rows = await db.Agenda.findAll({
      include: [
        {
          model: db.Event,
          as: "event",
          where: publishedEventWhere(),
          required: true,
        },
      ],
      order: [["start_time", "ASC"]],
    });

    res.json(
      rows.map((row) => ({
        id: row.id,
        eventId: String(row.event_id),
        eventTitle: row.event?.titulli || "Untitled event",
        session: row.title,
        startTime: formatTime(row.start_time),
        endTime: formatTime(row.end_time),
        date: formatDate(row.start_time),
        slot: formatTimeRange(row.start_time, row.end_time),
      })),
    );
  } catch (err) {
    console.error("GET /api/sponsor/schedule:", err.message);
    res.status(500).json({ error: "Failed to load schedule" });
  }
});

router.post("/requests", async (req, res) => {
  try {
    const {
      eventId,
      tierId,
      companyName,
      email,
      website,
      budget,
      message,
    } = req.body;

    if (!eventId || !tierId || !companyName || !email || budget == null) {
      return res.status(400).json({
        error:
          "Missing required fields: eventId, tierId, companyName, email, budget",
      });
    }

    const tierLabel = TIER_LABELS[tierId];
    if (!tierLabel) {
      return res.status(400).json({ error: "Invalid sponsorship tier" });
    }

    const event = await db.Event.findByPk(Number(eventId));
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.publication_status !== "published" || event.statusi === "anuluar") {
      return res.status(400).json({ error: "This event is not open for sponsorship" });
    }

    const amount = Number(budget);
    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: "Budget must be a valid number" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(companyName).trim();

    let sponsor = await db.Sponsor.findOne({
      where: { email: normalizedEmail },
    });

    if (!sponsor) {
      sponsor = await db.Sponsor.create({
        emertimi: normalizedName,
        email: normalizedEmail,
        website: website ? String(website).trim() : null,
        niveli_sponsorizimit: tierLabel,
        mesazhi: message ? String(message).trim() : null,
      });
    } else {
      await sponsor.update({
        emertimi: normalizedName,
        website: website ? String(website).trim() : sponsor.website,
        niveli_sponsorizimit: tierLabel,
        mesazhi: message ? String(message).trim() : sponsor.mesazhi,
      });
    }

    const existingLink = await db.EventSponsor.findOne({
      where: {
        event_id: event.id,
        sponsor_id: sponsor.id,
      },
    });

    if (existingLink) {
      return res.status(409).json({
        error: "You have already submitted a sponsorship request for this event",
      });
    }

    const link = await db.EventSponsor.create({
      event_id: event.id,
      sponsor_id: sponsor.id,
      shuma: amount,
      niveli_sponsorizimit: tierLabel,
      status: "pending",
    });

    const full = await db.EventSponsor.findByPk(link.id, {
      include: [{ model: db.Event, as: "event" }],
    });

    res.status(201).json({
      message: "Sponsorship request submitted successfully",
      request: mapRequest(full, sponsor),
    });
  } catch (err) {
    console.error("POST /api/sponsor/requests:", err.message);
    res.status(500).json({ error: "Failed to submit sponsorship request" });
  }
});

router.patch("/requests/:id", async (req, res) => {
  try {
    const { email, eventId, tierId, companyName, website, budget, message } =
      req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const owned = await findOwnedRequest(req.params.id, email);
    if (!owned) {
      return res.status(404).json({ error: "Sponsorship request not found" });
    }

    const { link, sponsor } = owned;
    const updates = {};

    if (tierId !== undefined) {
      const tierLabel = TIER_LABELS[tierId];
      if (!tierLabel) {
        return res.status(400).json({ error: "Invalid sponsorship tier" });
      }
      updates.niveli_sponsorizimit = tierLabel;
    }

    if (budget != null) {
      const amount = Number(budget);
      if (!Number.isFinite(amount) || amount < 0) {
        return res.status(400).json({ error: "Budget must be a valid number" });
      }
      updates.shuma = amount;
    }

    if (eventId !== undefined) {
      const event = await db.Event.findByPk(Number(eventId));
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      if (event.publication_status !== "published" || event.statusi === "anuluar") {
        return res.status(400).json({ error: "This event is not open for sponsorship" });
      }

      const duplicate = await db.EventSponsor.findOne({
        where: {
          event_id: event.id,
          sponsor_id: sponsor.id,
          id: { [Op.ne]: link.id },
        },
      });
      if (duplicate) {
        return res.status(409).json({
          error: "You already have a sponsorship request for this event",
        });
      }
      updates.event_id = event.id;
    }

    const sponsorUpdates = {};
    if (companyName !== undefined) {
      sponsorUpdates.emertimi = String(companyName).trim();
    }
    if (website !== undefined) {
      sponsorUpdates.website = website ? String(website).trim() : null;
    }
    if (message !== undefined) {
      sponsorUpdates.mesazhi = message ? String(message).trim() : null;
    }
    if (updates.niveli_sponsorizimit) {
      sponsorUpdates.niveli_sponsorizimit = updates.niveli_sponsorizimit;
    }

    if (Object.keys(updates).length) {
      await link.update(updates);
    }
    if (Object.keys(sponsorUpdates).length) {
      await sponsor.update(sponsorUpdates);
    }

    await link.reload({ include: [{ model: db.Event, as: "event" }] });
    await sponsor.reload();

    res.json({
      message: "Sponsorship request updated successfully",
      request: mapRequest(link, sponsor),
    });
  } catch (err) {
    console.error("PATCH /api/sponsor/requests/:id:", err.message);
    res.status(500).json({ error: "Failed to update sponsorship request" });
  }
});

router.delete("/requests/:id", async (req, res) => {
  try {
    const email = String(req.query.email || req.body?.email || "")
      .trim()
      .toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const owned = await findOwnedRequest(req.params.id, email);
    if (!owned) {
      return res.status(404).json({ error: "Sponsorship request not found" });
    }

    await owned.link.destroy();

    const remaining = await db.EventSponsor.count({
      where: { sponsor_id: owned.sponsor.id },
    });
    if (remaining === 0) {
      await owned.sponsor.destroy();
    }

    res.json({ message: "Sponsorship request deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/sponsor/requests/:id:", err.message);
    res.status(500).json({ error: "Failed to delete sponsorship request" });
  }
});

module.exports = router;
