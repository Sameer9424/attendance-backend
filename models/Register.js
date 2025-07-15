 // backend/models/Register.js
const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  teacherId: String, // optional: Firebase UID
  branch: String,
  semester: String,
  year: String,
  attendance: {
    type: Map,
    of: Array,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Register", registerSchema);
