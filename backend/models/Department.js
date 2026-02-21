const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
});

module.exports = mongoose.model("Department", departmentSchema, "departments");
