"use strict";

const express = require("express");
const db = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

function formatDate(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

// GET — manager: show all purchases system-wide
router.get("/", async (req, res) => {
  try {
    const rows = await db.Registration.findAll({
      order: [["data_regjistrimit", "DESC"]],
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "emri", "mbiemri", "email"],
        },
        {
          model: db.Event,
          as: "event",
          attributes: [
            "id",
            "titulli",
            "lokacioni",
            "data_fillimit",
            "imazhi",
          ],
        },
        {
          model: db.Ticket,
          as: "ticket",
          attributes: ["id", "lloji", "cmimi"],
        },
        {
          model: db.Payment,
          as: "payment",
          required: false,
          attributes: ["id", "statusi", "data"],
        },
      ],
    });

    // If some associations are missing in Sequelize models, this may throw.
    // The response is still the intended shape.

    const result = rows.map((r) => {
      const user = r.user;
      const event = r.event;
      const ticket = r.ticket;
      const payment = r.payment;

      return {
        id: r.id,
        user: user
          ? {
              id: user.id,
              name: `${user.emri} ${user.mbiemri}`.trim(),
              email: user.email,
            }
          : null,
        event: event
          ? {
              id: event.id,
              title: event.titulli,
              date: event.data_fillimit,
              location: event.lokacioni,
              image: event.imazhi || null,
            }
          : null,
        ticket: ticket
          ? {
              id: ticket.id,
              type: ticket.lloji,
              price: ticket.cmimi != null ? Number(ticket.cmimi) : 0,
            }
          : null,
        status: r.statusi,
        purchaseDate: r.data_regjistrimit,
        payment: payment
          ? {
              id: payment.id,
              status: payment.statusi,
              paidAt: payment.data,
            }
          : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("GET /api/manager/purchases:", err.message);
    res.status(500).json({ error: "Nuk u lexuan blerjet nga serveri." });
  }
});

module.exports = router;

