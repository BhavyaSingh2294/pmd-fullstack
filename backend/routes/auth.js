const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

require("../models/Department");
require("../models/School");
require("../models/Program");


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "pmd_jwt_secret_key_2024";

// POST /api/login  OR  POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { role, identifier, password } = req.body;

    if (!role || !identifier || !password) {
      return res.status(400).json({ message: "Role, identifier, and password are required" });
    }

    let user;

    if (role === "student") {
      user = await Student.findOne({ rollNumber: identifier })
        .populate("departmentId", "name")
        .populate("schoolId", "name")
        .populate("programId", "name");

      if (!user) {
        return res.status(401).json({ message: "Invalid roll number or password" });
      }
    } else if (role === "faculty") {
      user = await Faculty.findOne({ facultyId: identifier })
        .populate("departmentId", "name")
        .populate("schoolId", "name");

      if (!user) {
        return res.status(401).json({ message: "Invalid faculty ID or password" });
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const tokenPayload = {
      id: user._id,
      role: user.role,
      identifier: role === "student" ? user.rollNumber : user.facultyId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "24h" });

    // Return user data (exclude password)
    const userData = {
      _id: user._id,
      name: user.name,
      role: user.role,
      identifier: role === "student" ? user.rollNumber : user.facultyId,
      department: user.departmentId?.name || "",
      school: user.schoolId?.name || "",
      ...(role === "student" && {
        email: user.email,
        semester: user.semester,
        program: user.programId?.name || "",
      }),
      ...(role === "faculty" && {
        designation: user.designation,
      }),
    };

    res.json({ user: userData, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
