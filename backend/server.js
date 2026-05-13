require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db/connection");
const vocabularyRoutes = require("./routes/vocabularyRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/vocabulary", vocabularyRoutes);

app.get("/", (req, res) => {
  res.send("EnglishFlow AI API Running");
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({
      message: "MySQL connected",
      result: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "MySQL connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
