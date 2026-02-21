const express = require("express");
const Student = require("../models/Student");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/students - Get all students (faculty use)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const students = await Student.find({}, "-password")
      .populate("departmentId", "name")
      .populate("schoolId", "name")
      .populate("programId", "name");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

// GET /api/students/:id - Get student profile
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id, "-password")
      .populate("departmentId", "name")
      .populate("schoolId", "name")
      .populate("programId", "name");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student" });
  }
});

module.exports = router;
