const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const studentRoutes = require("./routes/students");
const facultyRoutes = require("./routes/faculties");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculties", facultyRoutes);

// Legacy login endpoint (matches existing frontend)
app.use("/api", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pmd";
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // console.log("✅ Connected to MongoDB - database: pmd");
    console.log("✅ Connected to MongoDB - cloud database: pmd");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
