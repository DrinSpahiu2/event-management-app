const express = require("express");
const router = express.Router();

// NOTE: The project currently doesn't implement certificates for speakers.
// This router is intentionally minimal to avoid 404s from the SpeakerDashboard.
// You can extend it later with real Certificate model logic.

router.get("/", async (req, res) => {
  return res.json([]);
});

router.post("/", async (req, res) => {
  return res.status(501).json({ error: "Certificates not implemented yet" });
});

router.patch("/:id", async (req, res) => {
  return res.status(501).json({ error: "Certificates not implemented yet" });
});

router.delete("/:id", async (req, res) => {
  return res.status(501).json({ error: "Certificates not implemented yet" });
});

module.exports = router;

