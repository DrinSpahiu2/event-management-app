const express = require("express");
const db = require("../models");

const router = express.Router();

function mapEvent(row) {
  return {
    id: String(row.id),
    name: row.titulli,
    date: row.data_fillimit ? new Date(row.data_fillimit).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }) : "",
    venue: row.lokacioni || "",
    status: row.publication_status === "published" ? "Published" : "Draft",
  };
}

router.get("/", async (req, res) => {
  try {
    const rows = await db.Event.findAll({ order: [["data_fillimit", "DESC"]] });
    res.json(rows.map(mapEvent));
  } catch (err) {
    console.error("GET /api/manager/events (CRUD):", err.message);
    res.status(500).json({ error: "Nuk u lexuan eventet" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const row = await db.Event.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Eventi nuk u gjet" });

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
    } = req.body;

    if (titulli !== undefined) row.titulli = titulli;
    if (pershkrimi !== undefined) row.pershkrimi = pershkrimi;

    if (data_fillimit !== undefined) row.data_fillimit = new Date(data_fillimit);
    if (data_perfundimit !== undefined) row.data_perfundimit = new Date(data_perfundimit);

    if (lokacioni !== undefined) row.lokacioni = lokacioni;
    if (kapaciteti !== undefined) {
      row.kapaciteti = kapaciteti === "" || kapaciteti == null ? null : Number(kapaciteti);
    }
    if (statusi !== undefined) row.statusi = statusi;
    if (publication_status !== undefined) row.publication_status = publication_status;
    if (organizer_id !== undefined) row.organizer_id = organizer_id === "" || organizer_id == null ? null : Number(organizer_id);
    if (imazhi !== undefined) row.imazhi = imazhi;

    await row.save();

    const updated = await db.Event.findByPk(row.id);
    res.json(mapEvent(updated));
  } catch (err) {
    console.error("PATCH /api/manager/events/:id (CRUD):", err.message);
    res.status(500).json({ error: "Nuk u përditësua eventi" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const row = await db.Event.findByPk(req.params.id);
    if (!row) return res.status(404).json({ error: "Eventi nuk u gjet" });
    await row.destroy();
    res.json({ message: "Eventi u fshi" });
  } catch (err) {
    console.error("DELETE /api/manager/events/:id (CRUD):", err.message);
    res.status(500).json({ error: "Nuk u fshi eventi" });
  }
});

module.exports = router;

