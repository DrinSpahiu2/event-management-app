const express = require("express");
const db = require("../models");

const router = express.Router();

function normalizeStatus(statusi) {
  if (!statusi) return "aktiv";
  const s = String(statusi).toLowerCase();
  if (s === "active" || s === "aktiv") return "aktiv";
  if (s === "suspended" || s === "inaktiv") return "inaktiv";
  if (s === "banuar") return "banuar";
  return "aktiv";
}

function roleToUserTypeEmri(role) {
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
      include: [{ model: db.UserType, as: "userType", attributes: ["emri"] }],
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
    console.error("GET /api/manager/users (CRUD):", err.message);
    res.status(500).json({ error: "Nuk u lexuan përdoruesit" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User nuk u gjet" });

    const { name, email, passwordi, telefoni, fotoja, role, status } = req.body;

    if (name !== undefined) {
      const parts = String(name).trim().split(" ");
      user.emri = parts[0] || user.emri;
      user.mbiemri = parts.slice(1).join(" ") || user.mbiemri;
    }

    if (email !== undefined) user.email = email;
    if (passwordi !== undefined) user.passwordi = passwordi;
    if (telefoni !== undefined) user.telefoni = telefoni;
    if (fotoja !== undefined) user.fotoja = fotoja;

    if (role !== undefined) {
      const utEmri = roleToUserTypeEmri(role);
      const ut = await db.UserType.findOne({ where: { emri: utEmri } });
      if (ut) user.user_type_id = ut.id;
    }

    if (status !== undefined) user.statusi = normalizeStatus(status);

    await user.save();

    const updated = await db.User.findByPk(user.id, {
      include: [{ model: db.UserType, as: "userType", attributes: ["emri"] }],
    });

    res.json({
      id: updated.id,
      name: `${updated.emri} ${updated.mbiemri}`.trim(),
      email: updated.email,
      role: updated.userType?.emri || "Client",
      status: statusToUi(updated.statusi),
    });
  } catch (err) {
    console.error("PATCH /api/manager/users/:id (CRUD):", err.message);
    res.status(500).json({ error: "Nuk u përditësua user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User nuk u gjet" });

    await user.destroy();
    res.json({ message: "User u fshi" });
  } catch (err) {
    console.error("DELETE /api/manager/users/:id (CRUD):", err.message);
    res.status(500).json({ error: "Nuk u fshi user" });
  }
});

module.exports = router;

