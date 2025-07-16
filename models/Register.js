 import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "./axiosConfig";

const daysInMonth = 31;

function RegisterPage() {
  const { id } = useParams();
  const [register, setRegister] = useState(null);
  const [month, setMonth] = useState("July");
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState("");

  // Fetch register data from backend
  useEffect(() => {
    const fetchRegister = async () => {
      try {
        const res = await axios.get(`/api/registers/${id}`);
        setRegister(res.data);
      } catch (error) {
        console.error("Error loading register:", error);
      }
    };
    fetchRegister();
  }, [id]);

  // Load attendance from register when month or register changes
  useEffect(() => {
    if (register && register.attendance && register.attendance[month]) {
      setStudents(register.attendance[month]);
    } else {
      setStudents([]);
    }
  }, [register, month]);

  const handleAddStudent = () => {
    if (newStudent.trim() !== "") {
      const student = {
        name: newStudent,
        attendance: Array(daysInMonth).fill(false),
      };
      setStudents([...students, student]);
      setNewStudent("");
    }
  };

  const toggleAttendance = (studentIndex, dayIndex) => {
    const updated = [...students];
    updated[studentIndex].attendance[dayIndex] = !updated[studentIndex].attendance[dayIndex];
    setStudents(updated);
  };

  // Auto-save attendance to backend when students or month change
  useEffect(() => {
    const saveAttendance = async () => {
      if (register) {
        try {
          await axios.put(`/api/registers/${id}/attendance`, {
            students,
            month,
          });
          console.log("✅ Auto-saved attendance");
        } catch (error) {
          console.error("❌ Error saving attendance", error);
        }
      }
    };
    saveAttendance();
  }, [students, month, id, register]);

  if (!register) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Attendance Register - {register.branch} - {register.semester} Semester - {register.year} Year
      </h2>

      {/* Month selector */}
      <div className="mb-4">
        <label className="mr-2">Select Month:</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-2 border rounded"
        >
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Add Student Input */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter student name"
          value={newStudent}
          onChange={(e) => setNewStudent(e.target.value)}
          className="p-2 border rounded w-full mr-2"
        />
        <button
          onClick={handleAddStudent}
          className="bg-green-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Name</th>
              {[...Array(daysInMonth)].map((_, i) => (
                <th key={i} className="border px-2">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{student.name}</td>
                {student.attendance.map((present, j) => (
                  <td
                    key={j}
                    className={`border px-2 py-1 cursor-pointer ${
                      present ? "bg-green-200" : "bg-red-100"
                    }`}
                    onClick={() => toggleAttendance(i, j)}
                  >
                    {present ? "✓" : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RegisterPage;
