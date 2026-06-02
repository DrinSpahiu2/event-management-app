const express = require("express");
const contactMessageService = require("../services/contactMessageService");

const router = express.Router();

function handleError(res, err) {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Gabim në server" });
}

router.get("/", async (req, res) => {
  try {
    const status = req.query.status;
    const messages = await contactMessageService.listContactMessages(status);
    res.json(messages);
  } catch (err) {
    console.error("GET /api/manager/contact-messages:", err.message);
    handleError(res, err);
  }
});

router.patch("/:id/reply", async (req, res) => {
  try {
    const updated = await contactMessageService.replyToContactMessage(
      req.params.id,
      req.body.pergjigja || req.body.reply,
    );
    res.json({
      message: "Përgjigja u ruajt",
      contactMessage: updated,
    });
  } catch (err) {
    console.error("PATCH /api/manager/contact-messages/:id/reply:", err.message);
    handleError(res, err);
  }
});

module.exports = router;
