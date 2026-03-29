const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // <--- Make sure there is a comma here!
    port: process.env.DB_PORT ,     // <--- And here!
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Error:', err.message);
    } else {
        console.log('✅ Connected to XAMPP MySQL on port ' + process.env.DB_PORT);
    }
});

// --- TEST ROUTE ---
app.get('/', (req, res) => {
    res.send("Server is running and trying to connect to DB...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});