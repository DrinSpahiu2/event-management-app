const express = require("express");
const db = require("../models");

const router = express.Router();

function normalizeStatus(statusi) {
  // UI uses: Active / Suspended
  // DB uses: aktiv / inaktiv / banuar
  if (!statusi) return "aktiv";
  const s = String(statusi).toLowerCase();
  if (s === "active" || s === "aktiv") return "aktiv";
  if (s === "suspended" || s === "inaktiv") return "inaktiv";
  if (s === "banuar") return "banuar";
  return "aktiv";
}

function roleToUserTypeEmri(role) {
  // Manager UI dropdown values -> seed UserTypes.emri
  const map = {
    Attendee: "Client",
    Client: "Client",
    Organizer: "Sponsor",
    Speaker: "Speaker",
    Sponsor: "Sponsor",
    Manager: "Manager",
    SuperAdmin: "SuperAdmin",
  };
  return map[role] || "Client";
}

function statusToUi(statusi) {
  if (statusi === "aktiv") return "Active";
  if (statusi === "inaktiv") return "Suspended";
  if (statusi === "banuar") return "Suspended";
  return "Active";
}

router.get("/", async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "emri", "mbiemri", "email", "statusi", "user_type_id"],
      include: [
        {
          model: db.UserType,
          as: "userType",
          attributes: ["emri"],
        },
      ],
      where: undefined,
      order: [["emri", "ASC"]],
    });

    res.json(
      users.map((u) => ({
        id: u.id,
        name: `${u.emri} ${u.mbiemri}`.trim(),
        role: u.userType?.emri || "Client",
        status: statusToUi(u.statusi),
        email: u.email,
      }))
    );
  } catch (err) {
    console.error("GET /api/manager/users", err.message);
    res.status(500).json({ error: "Nuk u lexuan përdoruesit" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, role, email, passwordi, telefoni, fotoja } = req.body;
    if (!name) return res.status(400).json({ error: "name është i detyrueshëm" });
    if (!email) return res.status(400).json({ error: "email është i detyrueshëm" });
    if (!passwordi) return res.status(400).json({ error: "passwordi është i detyrueshëm" });

    const [emri, ...rest] = String(name).trim().split(" ");
    const mbiemri = rest.join(" ") || "User";

    const userTypeEmri = roleToUserTypeEmri(role);
    const userType = await db.UserType.findOne({ where: { emri: userTypeEmri } });
    if (!userType) return res.status(400).json({ error: "User type nuk u gjet" });

    const user = await db.User.create({
      emri: emri || name,
      mbiemri,
      email,
      // NOTE: This project stores passwords as plain text in some places.
      // If you use bcrypt elsewhere, update this to hash before saving.
      passwordi,
      telefoni: telefoni ?? null,
      fotoja: fotoja ?? null,
      user_type_id: userType.id,
      statusi: "aktiv",
    });

    res.status(201).json({
      id: user.id,
      name: `${user.emri} ${user.mbiemri}`.trim(),
      role: userType.emri,
      status: statusToUi(user.statusi),
      email: user.email,
    });
  } catch (err) {
    console.error("POST /api/manager/users", err.message);
    res.status(500).json({ error: "Nuk u krijua përdoruesi" });
  }
});


router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const user = await db.User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User nuk u gjet" });

    user.statusi = normalizeStatus(status);
    await user.save();

    res.json({
      id: user.id,
      status: statusToUi(user.statusi),
    });
  } catch (err) {
    console.error("PATCH /api/manager/users/:id/status", err.message);
    res.status(500).json({ error: "Nuk u përditësua statusi" });
  }
});

module.exports = router;

