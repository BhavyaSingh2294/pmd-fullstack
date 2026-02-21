const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: "faculty" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
});

module.exports = mongoose.model("Faculty", facultySchema, "faculties");
