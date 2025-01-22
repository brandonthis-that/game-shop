const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/db"); // Import the database connection

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).send("Error registering user.");
      }
      res.status(200).send("User registered successfully.");
    }
  );
});

// User login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err || !user) {
        return res.status(400).send("User not found.");
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).send("Invalid credentials.");
      }
      res.status(200).send("Logged in successfully.");
    }
  );
});

module.exports = router;
