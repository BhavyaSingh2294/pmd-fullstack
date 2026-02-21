const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "Open" },
  currentPhase: { type: String, default: "Problem Identification" },
  appliedStudentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  primaryFacultyMentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  facultyCoMentorsMRU: { type: String },
  industryMentors: { type: String },
  alumniMentors: { type: String },
  externalFacultyMentors: { type: String },
  disciplinesInvolved: { type: String },
  expectedOutcomes: { type: String },
  sdgImpact: { type: String },
  impactStatement: { type: String },
});

module.exports = mongoose.model("Project", projectSchema, "projects");
