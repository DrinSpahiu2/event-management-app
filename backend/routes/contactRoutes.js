const express = require("express");
const contactMessageService = require("../services/contactMessageService");

const router = express.Router();

function handleError(res, err) {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Gabim në server" });
}

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const created = await contactMessageService.createContactMessage({
      name,
      email,
      subject,
      message,
    });
    res.status(201).json({
      message: "Mesazhi u dërgua. Do t'ju përgjigjemi së shpejti.",
      contactMessage: created,
    });
  } catch (err) {
    console.error("POST /api/contact:", err.message);
    handleError(res, err);
  }
});

module.exports = router;
