const express = require("express");
const jwt = require("jsonwebtoken");

const crypto = require("crypto");




const router = express.Router();


router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken is required" });
    }

    const rtRow = await req.app
      .get("db")
      .RefreshToken.findOne({
        where: { token: refreshToken, revoked_at: null },
      });

    if (!rtRow) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    if (rtRow.expires_at && new Date(rtRow.expires_at) < new Date()) {
      return res.status(403).json({ error: "Refresh token expired" });
    }

    const user = await req.app.get("db").User.findByPk(rtRow.user_id);


    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token user" });
    }


    const newRefreshToken = crypto.randomBytes(64).toString("hex");

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

   
    await rtRow.update({ revoked_at: new Date() });

    await req.app.get("db").RefreshToken.create({
      token: newRefreshToken,
      user_id: user.id,
      expires_at: expiresAt,
      revoked_at: null,
    });

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.userType?.emri || "Client",
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return res.json({ token: accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error("/api/auth/refresh error:", err);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});


module.exports = router;

