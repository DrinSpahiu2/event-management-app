const express = require("express");
const certificateService = require("../services/certificateService");

const router = express.Router();

function handleError(res, err) {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Gabim në server" });
}

/** POST — Manager issues a certificate */
router.post("/", async (req, res) => {
  try {
    const { user_id, event_id, kodi, data_leshimit } = req.body;
    if (!user_id || !event_id) {
      return res.status(400).json({ error: "user_id dhe event_id janë të detyrueshme" });
    }
    const cert = await certificateService.issueCertificate({
      user_id,
      event_id,
      kodi,
      data_leshimit,
    });
    res.status(201).json(cert);
  } catch (err) {
    console.error("POST /certificates:", err.message);
    handleError(res, err);
  }
});

/** GET — All certificates for an event (stats + list) */
router.get("/event/:eventId", async (req, res) => {
  try {
    const data = await certificateService.getCertificatesByEvent(req.params.eventId);
    res.json(data);
  } catch (err) {
    console.error("GET /certificates/event:", err.message);
    handleError(res, err);
  }
});

/** GET — Certificates for a user (view mine) */
router.get("/user/:userId", async (req, res) => {
  try {
    const certificates = await certificateService.getCertificatesByUser(req.params.userId);
    res.json(certificates);
  } catch (err) {
    console.error("GET /certificates/user:", err.message);
    handleError(res, err);
  }
});

/** DELETE — Manager revokes a certificate */
router.delete("/:id", async (req, res) => {
  try {
    const result = await certificateService.revokeCertificate(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("DELETE /certificates:", err.message);
    handleError(res, err);
  }
});

module.exports = router;
