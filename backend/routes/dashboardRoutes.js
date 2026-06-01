const express = require("express");
const { getDashboardStats } = require("../services/dashboardService");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    console.error("GET /dashboard/stats:", err.message);
    res.status(500).json({ error: "Nuk u lexuan statistikat e dashboard-it" });
  }
});

module.exports = router;
