const express = require("express");
const Project = require("../models/Project");
const Faculty = require("../models/Faculty");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/projects - Get all projects (with faculty name populated)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("primaryFacultyMentorId", "name facultyId designation")
      .populate("appliedStudentIds", "name rollNumber")
      .lean();

    // Transform to include faculty name
    const transformed = projects.map((p) => ({
      ...p,
      facultyName: p.primaryFacultyMentorId?.name || "Unknown Faculty",
      facultyId: p.primaryFacultyMentorId?.facultyId || "",
      departments: p.disciplinesInvolved
        ? p.disciplinesInvolved.split(",").map((d) => d.trim()).filter(Boolean)
        : [],
      enrolledCount: p.appliedStudentIds?.length || 0,
    }));

    res.json(transformed);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// GET /api/projects/faculty/:facultyId - Get projects by faculty MongoDB _id
router.get("/faculty/:facultyId", authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({
      primaryFacultyMentorId: req.params.facultyId,
    })
      .populate("primaryFacultyMentorId", "name facultyId designation")
      .populate("appliedStudentIds", "name rollNumber")
      .lean();

    const transformed = projects.map((p) => ({
      ...p,
      facultyName: p.primaryFacultyMentorId?.name || "Unknown Faculty",
      departments: p.disciplinesInvolved
        ? p.disciplinesInvolved.split(",").map((d) => d.trim()).filter(Boolean)
        : [],
      enrolledCount: p.appliedStudentIds?.length || 0,
    }));

    res.json(transformed);
  } catch (error) {
    console.error("Error fetching faculty projects:", error);
    res.status(500).json({ message: "Error fetching faculty projects" });
  }
});

// GET /api/projects/student/:studentId - Get projects student is enrolled in
router.get("/student/:studentId", authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({
      appliedStudentIds: req.params.studentId,
    })
      .populate("primaryFacultyMentorId", "name facultyId designation")
      .lean();

    const transformed = projects.map((p) => ({
      ...p,
      facultyName: p.primaryFacultyMentorId?.name || "Unknown Faculty",
      departments: p.disciplinesInvolved
        ? p.disciplinesInvolved.split(",").map((d) => d.trim()).filter(Boolean)
        : [],
      enrolledCount: p.appliedStudentIds?.length || 0,
    }));

    res.json(transformed);
  } catch (error) {
    console.error("Error fetching student projects:", error);
    res.status(500).json({ message: "Error fetching student projects" });
  }
});

// GET /api/projects/available - Get open projects for students to browse
router.get("/available", authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ status: "Open" })
      .populate("primaryFacultyMentorId", "name facultyId designation")
      .lean();

    const transformed = projects.map((p) => ({
      ...p,
      facultyName: p.primaryFacultyMentorId?.name || "Unknown Faculty",
      departments: p.disciplinesInvolved
        ? p.disciplinesInvolved.split(",").map((d) => d.trim()).filter(Boolean)
        : [],
      enrolledCount: p.appliedStudentIds?.length || 0,
    }));

    res.json(transformed);
  } catch (error) {
    console.error("Error fetching available projects:", error);
    res.status(500).json({ message: "Error fetching available projects" });
  }
});

// POST /api/projects/:id/apply - Student applies to a project
router.post("/:id/apply", authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.appliedStudentIds.includes(req.user.id)) {
      return res.status(400).json({ message: "Already applied to this project" });
    }

    project.appliedStudentIds.push(req.user.id);
    await project.save();

    res.json({ message: "Successfully applied to project", project });
  } catch (error) {
    console.error("Error applying to project:", error);
    res.status(500).json({ message: "Error applying to project" });
  }
});

// PUT /api/projects/:id/advance-phase - Faculty advances project phase
router.put("/:id/advance-phase", authenticateToken, async (req, res) => {
  try {
    const phases = [
      "Problem Identification",
      "Solution Design",
      "Testing & Evaluation",
      "Final Presentation",
    ];

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const currentIndex = phases.indexOf(project.currentPhase || "Problem Identification");
    if (currentIndex < phases.length - 1) {
      project.currentPhase = phases[currentIndex + 1];
      if (project.currentPhase === "Final Presentation") {
        project.status = "Completed";
      } else if (project.status === "Open") {
        project.status = "In Progress";
      }
      await project.save();
    }

    res.json({ message: "Phase advanced", project });
  } catch (error) {
    console.error("Error advancing phase:", error);
    res.status(500).json({ message: "Error advancing phase" });
  }
});

module.exports = router;
