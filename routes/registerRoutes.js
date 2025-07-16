 const express = require("express");
const router = express.Router();
const Register = require("../models/Register");

// ➕ POST: Create new register
router.post("/", async (req, res) => {
  try {
    const { branch, semester, year, teacherId } = req.body;
    if (!branch || !semester || !year || !teacherId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRegister = new Register({ branch, semester, year, teacherId });
    await newRegister.save();

    res.status(201).json({ message: "Register saved", register: newRegister });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 🔁 GET: Get all registers for a teacher
router.get("/", async (req, res) => {
  try {
    const { teacherId } = req.query;
    const query = teacherId ? { teacherId } : {};

    const registers = await Register.find(query).sort({ createdAt: -1 });
    res.json(registers);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// ✅ GET: Get a register by ID
router.get("/:id", async (req, res) => {
  try {
    const register = await Register.findById(req.params.id);

    if (!register) {
      return res.status(404).json({ message: "Register not found" });
    }

    res.json(register);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// 📝 PUT: Save attendance
router.put("/:id/attendance", async (req, res) => {
  try {
    const { students, month } = req.body;

    if (!month || !Array.isArray(students)) {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    const updatedRegister = await Register.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          [`attendance.${month}`]: students,
        },
      },
      { new: true }
    );

    res.json({ message: "Attendance saved", register: updatedRegister });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// ❌ DELETE: Delete a register
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Register.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Register not found" });
    }

    res.json({ message: "Register deleted ✅" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

module.exports = router;
