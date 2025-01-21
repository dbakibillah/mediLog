const express = require("express");
require("dotenv").config();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8081;

// if (!process.env.ACCESS_TOKEN) {
//   throw new Error("ACCESS_TOKEN is not defined in environment variables");
// }
const JWT_SECRET = process.env.ACCESS_TOKEN;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Database connection
const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "medilog",
});

database.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// Reconnect on database disconnection
database.on("error", (err) => {
  console.error("Database error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    database.connect();
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("mediLog server is running");
});

// POST API for /jwt
// app.post("/jwt", (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   // Generate JWT token
//   const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

//   // Send token as an HTTP-only cookie
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Use HTTPS in production
//     sameSite: "Lax",
//   });

//   return res
//     .status(200)
//     .json({ message: "Token generated successfully", token });
// });

// Route for logout
// app.post("/logout", (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Use HTTPS in production
//     sameSite: "Lax",
//   });

//   return res.status(200).json({ message: "Logged out successfully" });
// });

// GET API for /users
app.get("/users", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  database.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Failed to fetch user" });
    }

    res.json({ exists: results.length > 0 });
  });
});

// POST API for /users
app.post("/users", (req, res) => {
  const {
    name,
    email,
    user_type = "patient",
    last_login = new Date(),
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const query = `
    INSERT INTO users (name, email, user_type, last_login) 
    VALUES (?, ?, ?, ?)
  `;
  const values = [name, email, user_type, last_login];

  database.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ error: "Failed to register user" });
    }
    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  });
});

// GET API for /doctors
app.get("/doctors", (req, res) => {
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const offset = (page - 1) * limit;

  const query = `SELECT * FROM doctors LIMIT ? OFFSET ?`;
  database.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }
    const countQuery = "SELECT COUNT(*) AS total FROM doctors";
    database.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error fetching total doctor count:", err);
        return res
          .status(500)
          .json({ error: "Failed to fetch total doctor count" });
      }
      const totalDoctors = countResult[0].total;
      const totalPages = Math.ceil(totalDoctors / limit);
      res.json({
        doctors: results,
        total: totalDoctors,
        totalPages: totalPages,
        currentPage: page,
      });
    });
  });
});

// GET API for /doctors/:id
app.get("/doctors/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Doctor ID is required" });
  }

  const query = "SELECT * FROM doctors WHERE id = ?";
  database.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching doctor details:", err);
      return res.status(500).json({ error: "Failed to fetch doctor details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(results[0]);
  });
});

// Get API for All Medical Tests
app.get("/medicaltests", (req, res) => {
  const query = "SELECT * FROM medicaltests";
  database.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching medical tests:", err);
      return res.status(500).json({ error: "Failed to fetch medical tests" });
    }
    res.json(results);
  });
});

// POST API for Appointments
// POST API for /appointments
app.post("/appointments", (req, res) => {
  const {
    patientName,
    patientEmail,
    doctorId,
    doctorName,
    hospitalName,
    consultationDate,
    consultationTime,
    disease,
    additionalNotes,
    status = "pending",
  } = req.body;

  // Validate required fields
  if (
    !patientName ||
    !doctorId ||
    !consultationDate ||
    !consultationTime ||
    !disease
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Query to insert the appointment into the database
  const query = `
    INSERT INTO appointments 
      (patient_name, patient_email, doctor_id, doctor_name, hospital_name, consultation_date, consultation_time, disease, additional_notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    patientName,
    patientEmail,
    doctorId,
    doctorName,
    hospitalName,
    consultationDate,
    consultationTime,
    disease,
    additionalNotes,
    status,
  ];

  // Execute the query
  database.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting appointment:", err);
      return res.status(500).json({ error: "Failed to create appointment" });
    }

    // Send success response
    res.status(201).json({
      message: "Appointment created successfully",
      appointmentId: result.insertId,
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
