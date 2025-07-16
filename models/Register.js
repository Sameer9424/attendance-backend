 const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  attendance: [Boolean],
});

const registerSchema = new mongoose.Schema({
  branch: String,
  semester: String,
  year: String,
  teacherId: String,
  attendance: {
    type: Map,
    of: [studentSchema],
    default: {},
  },
});

module.exports = mongoose.model("Register", registerSchema);
