 // backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Proper CORS config
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://attendance-register-c2zx.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// Routes
const registerRoutes = require("./routes/registerRoutes");
app.use("/api/registers", registerRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("ERROR: MONGO_URI is not defined in the environment variables.");
  process.exit(1);  // Stop server if URI is missing
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Stop server if connection fails
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
