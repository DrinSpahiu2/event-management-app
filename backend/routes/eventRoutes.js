const express = require("express");
const router = express.Router();
const { Event } = require("../models"); // Adjust path based on your backend structure

// ==========================================
// 1. READ ALL EVENTS (GET)
// ==========================================
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [["data_fillimit", "ASC"]] // Organizes list by starting date
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Gabim gjatë marrjes së ngjarjeve:", error);
    res.status(500).json({ message: "Ndodhi një gabim në server." });
  }
});

// ==========================================
// 2. CREATE NEW EVENT (POST)
// ==========================================
router.post("/", async (req, res) => {
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
      venue_id
    } = req.body;

    const newEvent = await Event.create({
      titulli,
      pershkrimi,
      data_fillimit,
      data_perfundimit,
      lokacioni,
      kapaciteti: capacityValue(kapaciteti),
      statusi: statusi || "aktiv",
      publication_status: publication_status || "published",
      organizer_id: organizer_id || 4,
      venue_id: venue_id || null
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Gabim gjatë krijimit të ngjarjes:", error);
    res.status(400).json({ message: "Të dhënat nuk mund të procesoheshin." });
  }
});

// ==========================================
// 3. UPDATE AN EVENT (PUT)
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Ngjarja nuk u gjet." });
    }

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
      venue_id
    } = req.body;

    await event.update({
      titulli,
      pershkrimi,
      data_fillimit,
      data_perfundimit,
      lokacioni,
      kapaciteti: capacityValue(kapaciteti),
      statusi,
      publication_status,
      organizer_id,
      venue_id: venue_id || null
    });

    res.status(200).json(event);
  } catch (error) {
    console.error("Gabim gjatë përditësimit të ngjarjes:", error);
    res.status(400).json({ message: "Përditësimi dështoi." });
  }
});

// ==========================================
// 4. DELETE AN EVENT (DELETE)
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Ngjarja nuk u gjet." });
    }

    await event.destroy();
    res.status(200).json({ message: "Ngjarja u fshi me sukses." });
  } catch (error) {
    console.error("Gabim gjatë fshirjes:", error);
    res.status(500).json({ message: "Fshirja dështoi nga serveri." });
  }
});

// Helper function to safely process capacity integers
function capacityValue(val) {
  const num = parseInt(val, 10);
  return isNaN(num) ? 0 : num;
}

module.exports = router;