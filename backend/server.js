const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION WITH SEQUELIZE ---
const db = require("./models");

db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL database");
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
  });

// --- TEST ROUTE ---
app.get("/", (req, res) => {
  res.send("Server is running and connected to DB...");
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// --- SIGN UP ENDPOINT ---
app.post("/api/signup", async (req, res) => {
  try {
    const { emri, mbiemri, email, passwordi, telefoni, fotoja } = req.body;

    // Validation
    if (!emri || !mbiemri || !email || !passwordi) {
      return res.status(400).json({
        error: "Missing required fields: emri, mbiemri, email, passwordi",
      });
    }

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(passwordi, 10);

    // Create user with default role (Attendee = 5)
    const newUser = await db.User.create({
      emri,
      mbiemri,
      email,
      passwordi: hashedPassword,
      telefoni: telefoni || null,
      fotoja: fotoja || null,
      user_type_id: 5, // Default to Attendee - SuperAdmin will assign actual role
      statusi: "aktiv",
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
    console.error("❌ Sign up error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to register user: " + error.message });
  }
});

// --- SIGN IN ENDPOINT ---
app.post("/api/signin", async (req, res) => {
  try {
    const { email, passwordi } = req.body;

    if (!email || !passwordi) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(passwordi, user.passwordi);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Sign in successful",
      userId: user.id,
      email: user.email,
      emri: user.emri,
      user_type_id: user.user_type_id,
    });
  } catch (error) {
    console.error("❌ Sign in error:", error.message);
    res.status(500).json({ error: "Failed to sign in: " + error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
