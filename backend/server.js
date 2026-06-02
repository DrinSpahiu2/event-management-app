const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

// --- MIDDLEWARE CONFIGURATIONS ---
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

// --- TEST ROUTES ---
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

    if (!emri || !mbiemri || !email || !passwordi) {
      return res.status(400).json({
        error: "Missing required fields: emri, mbiemri, email, passwordi",
      });
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(passwordi, 10);

    const defaultUserType = await db.UserType.findOne({
      where: { emri: "Client" },
    });
    if (!defaultUserType) {
      return res.status(500).json({
        error:
          "Default user role is missing. Run: npx sequelize-cli db:seed:all",
      });
    }

    const newUser = await db.User.create({
      emri,
      mbiemri,
      email,
      passwordi: hashedPassword,
      telefoni: telefoni || null,
      fotoja: fotoja || null,

      user_type_id: defaultUserType.id,
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

    const user = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.UserType,
          as: "userType",
          attributes: ["emri"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(passwordi, user.passwordi);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const roleName = user.userType ? user.userType.emri : "Client";

    res.json({
      message: "Sign in successful",
      userId: user.id,
      email: user.email,
      emri: user.emri,
      user_type_id: user.user_type_id,
      role: roleName,
    });
  } catch (error) {
    console.error("❌ Sign in error:", error.message);
    res.status(500).json({ error: "Failed to sign in: " + error.message });
  }
});

// --- GET ALL USERS (Për Admin) ---
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "emri", "mbiemri", "email", "statusi", "user_type_id"],
      include: [
        {
          model: db.UserType,
          as: "userType",
          attributes: ["emri"],
        },
      ],
    });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// --- UPDATE USER ROLE (Për Admin) ---
app.put("/api/admin/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_type_id } = req.body;

    if (!user_type_id) {
      return res.status(400).json({ error: "User type ID is required" });
    }

    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.user_type_id = user_type_id;
    await user.save();

    res.json({ message: "User role updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating user role:", error.message);
    res.status(500).json({ error: "Failed to update user role" });
  }
});

// --- EXTERNAL ROUTER IMPORTS & ROUTING ---

// Manager Routes
const managerRoutes = require("./routes/managerRoutes");
const managerUsersRoutes = require("./routes/managerUsersRoutes");
const managerScheduleRoutes = require("./routes/managerScheduleRoutes");
const managerUsersCrudRoutes = require("./routes/managerUsersCrudRoutes");
const managerEventsRoutes = require("./routes/managerEventsRoutes");
const managerEventCategoriesRoutes = require("./routes/managerEventCategoriesRoutes");

app.use("/api/manager", managerRoutes);
app.use("/api/manager/users", managerUsersRoutes);
app.use("/api/manager/users-crud", managerUsersCrudRoutes);
app.use("/api/manager/schedule", managerScheduleRoutes);
app.use("/api/manager/events-crud", managerEventsRoutes);
app.use("/api/manager/event-categories", managerEventCategoriesRoutes);

// Speaker Routes
const speakerRoutes = require("./routes/speakerRoutes");
const speakerCertificatesRoutes = require("./routes/speakerCertificatesRoutes");
app.use("/api/speaker", speakerRoutes);
app.use("/api/speaker/certificates", speakerCertificatesRoutes);

// Sponsor Routes
const sponsorRoutes = require("./routes/sponsorRoutes");
app.use("/api/sponsor", sponsorRoutes);

// New Events CRUD Routes
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

// Tickets CRUD
const ticketRoutes = require("./routes/ticketRoutes");
app.use("/api/tickets", ticketRoutes);

// Registrations (client purchases)
const registrationRoutes = require("./routes/registrationRoutes");
app.use("/api/registrations", registrationRoutes);

// Feedback
const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

// Manager: view all feedback
const managerFeedbackRoutes = require("./routes/managerFeedbackRoutes");
app.use("/api/manager/feedback", managerFeedbackRoutes);

// Dashboard stats
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Certificates
const certificateRoutes = require("./routes/certificateRoutes");
app.use("/api/certificates", certificateRoutes);

// Coupons
const couponRoutes = require("./routes/couponRoutes");
app.use("/api/coupons", couponRoutes);

// Sponsorship Requests (manager)
const managerSponsorshipRoutes = require("./routes/managerSponsorshipRoutes");
app.use("/api/manager/sponsorships", managerSponsorshipRoutes);

// Contact form (public) + manager inbox
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);
const managerContactRoutes = require("./routes/managerContactRoutes");
app.use("/api/manager/contact-messages", managerContactRoutes);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

