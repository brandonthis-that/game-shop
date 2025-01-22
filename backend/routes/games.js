const express = require("express");
const db = require("../db/db"); // Import the database connection

const router = express.Router();

// Get all games
router.get("/", (req, res) => {
  db.all(`SELECT * FROM games`, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Add new game
router.post("/", (req, res) => {
  const { title, description, category, price, rating, release_date } =
    req.body;

  db.run(
    `INSERT INTO games (title, description, category, price, rating, release_date) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, category, price, rating, release_date],
    function (err) {
      if (err) {
        return res.status(500).send("Error adding game.");
      }
      res.status(200).send("Game added successfully.");
    }
  );
});

module.exports = router;
