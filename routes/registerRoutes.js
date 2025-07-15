 const express = require("express");
const router = express.Router();
const Register = require("../models/Register");

// ➕ POST: Create new register
router.post("/", async (req, res) => {
  try {
    const { branch, semester, year, teacherId } = req.body;
    const newRegister = new Register({ branch, semester, year, teacherId });
    await newRegister.save();
    res.status(201).json({ message: "Register saved", register: newRegister });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔁 GET: Get all registers of a teacher
router.get("/", async (req, res) => {
  try {
    const teacherId = req.query.teacherId;
    const query = teacherId ? { teacherId } : {};
    const registers = await Register.find(query).sort({ createdAt: -1 });
    res.json(registers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: Get single register by ID
router.get("/:id", async (req, res) => {
  try {
    const register = await Register.findById(req.params.id);
    if (!register) return res.status(404).json({ message: "Register not found" });
    res.json(register);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📝 PUT: Save attendance data
router.put("/:id/attendance", async (req, res) => {
  try {
    const { students, month } = req.body;

    const updatedRegister = await Register.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          [`attendance.${month}`]: students
        }
      },
      { new: true }
    );

    res.json({ message: "Attendance saved", register: updatedRegister });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE: Remove register by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Register.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Register not found" });
    }
    res.json({ message: "Register deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
