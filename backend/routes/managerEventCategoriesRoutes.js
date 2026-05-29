const express = require("express");
const db = require("../models");

const router = express.Router();

function mapCategory(row) {
  return {
    id: row.id,
    emertimi: row.emertimi,
    pershkrimi: row.pershkrimi || "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

router.get("/", async (req, res) => {
  try {
    const rows = await db.EventCategory.findAll({
      order: [["emertimi", "ASC"]],
    });
    res.json(rows.map(mapCategory));
  } catch (err) {
    console.error("GET /api/manager/event-categories:", err.message);
    res.status(500).json({ error: "Nuk u lexuan kategoritë" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const row = await db.EventCategory.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Kategoria nuk u gjet" });
    res.json(mapCategory(row));
  } catch (err) {
    console.error("GET /api/manager/event-categories/:id:", err.message);
    res.status(500).json({ error: "Nuk u lexua kategoria" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { emertimi, pershkrimi } = req.body;
    if (!emertimi || !String(emertimi).trim()) {
      return res.status(400).json({ error: "emertimi është i detyrueshëm" });
    }

    const row = await db.EventCategory.create({
      emertimi: String(emertimi).trim(),
      pershkrimi: pershkrimi != null ? String(pershkrimi) : null,
    });

    res.status(201).json(mapCategory(row));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Ky emërtim ekziston tashmë" });
    }
    console.error("POST /api/manager/event-categories:", err.message);
    res.status(500).json({ error: "Nuk u krijua kategoria" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const row = await db.EventCategory.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Kategoria nuk u gjet" });

    const { emertimi, pershkrimi } = req.body;
    if (emertimi !== undefined) {
      if (!String(emertimi).trim()) {
        return res.status(400).json({ error: "emertimi nuk mund të jetë bosh" });
      }
      row.emertimi = String(emertimi).trim();
    }
    if (pershkrimi !== undefined) {
      row.pershkrimi = pershkrimi === "" ? null : String(pershkrimi);
    }

    await row.save();
    res.json(mapCategory(row));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Ky emërtim ekziston tashmë" });
    }
    console.error("PATCH /api/manager/event-categories/:id:", err.message);
    res.status(500).json({ error: "Nuk u përditësua kategoria" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const row = await db.EventCategory.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Kategoria nuk u gjet" });

    await row.destroy();
    res.json({ message: "Kategoria u fshi" });
  } catch (err) {
    console.error("DELETE /api/manager/event-categories/:id:", err.message);
    res.status(500).json({ error: "Nuk u fshi kategoria" });
  }
});

module.exports = router;
