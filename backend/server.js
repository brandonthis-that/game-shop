const express = require("express");
const cors = require("cors"); // Add this
const db = require("./db/db");
const userRoutes = require("./routes/users");
const gameRoutes = require("./routes/games");

const app = express();
const port = 3000;

app.use(cors()); // Add this
app.use(express.json());

app.use("/users", userRoutes);
app.use("/games", gameRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
