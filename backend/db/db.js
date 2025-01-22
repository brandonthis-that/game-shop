const sqlite3 = require("sqlite3").verbose();

// Create a new database connection
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Export the database connection
module.exports = db;
