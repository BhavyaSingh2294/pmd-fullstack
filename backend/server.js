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
// app.use(cors({ origin: "*" }));


// Middleware
const allowedOrigins = [
  "http://localhost:5173", // For local development
  "https://pmd-frontend-five.vercel.app" // Your actual Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));



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
