const express = require("express");
const Faculty = require("../models/Faculty");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/faculties - Get all faculty members
router.get("/", authenticateToken, async (req, res) => {
  try {
    const faculties = await Faculty.find({}, "-password")
      .populate("departmentId", "name")
      .populate("schoolId", "name");
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculties" });
  }
});

// GET /api/faculties/:id - Get faculty profile
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id, "-password")
      .populate("departmentId", "name")
      .populate("schoolId", "name");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty" });
  }
});

module.exports = router;
