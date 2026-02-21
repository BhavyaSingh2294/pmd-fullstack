const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  semester: { type: Number },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
});

module.exports = mongoose.model("Student", studentSchema, "students");
