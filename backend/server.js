const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(express.json());
const db = new sqlite3.Database('./database.db');

//user registration
app.post("/register", async (req, res) => {
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

// login
app.post("/login", (req, res) => {
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

//get all games
app.get("/games", (req, res) => {
  db.all(`SELECT * FROM games`, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// Add New Game
app.post('/games', (req, res) => {
    const { title, description, category, price, rating, release_date } = req.body;
    db.run(`INSERT INTO games (title, description, category, price, rating, release_date) VALUES (?, ?, ?, ?, ?, ?)`, 
        [title, description, category, price, rating, release_date], 
        function(err) {
            if (err) {
                return res.status(500).send("Error adding game.");
            }
            res.status(200).send("Game added successfully.");
        }
    );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});