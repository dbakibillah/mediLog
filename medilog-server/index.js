const express = require("express");
require("dotenv").config();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8081;

if (!process.env.ACCESS_TOKEN) {
  throw new Error("ACCESS_TOKEN is not defined in environment variables");
}
const JWT_SECRET = process.env.ACCESS_TOKEN;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://medilog-458b6.web.app"],
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allow these headers
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// Database connection
const database = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "medilog",
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
app.post("/jwt", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate JWT token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

  // Send token as an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "Lax",
  });

  return res
    .status(200)
    .json({ message: "Token generated successfully", token });
});

// Route for logout
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "Lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

// GET API for users (Public)
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  database.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.json(results);
  });
});

// GET API for /users (for login authentication)
app.get("/users-login", (req, res) => {
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

// GET API for /users/:email(for user type)
app.get("/users/:email", (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT user_type FROM users WHERE email = ?";
  database.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user type:", err);
      return res.status(500).json({ error: "Failed to fetch user type" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0].user_type);
  });
});

// GET API for /users/:email(for user profile)
app.get("/users-profile/:email", (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE email = ?"; // Fetch all user data
  database.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ error: "Failed to fetch user data" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(results[0]);
  });
});

// PUT API to update user data
app.put("/users-profile/:email", (req, res) => {
  const email = req.params.email;
  const {
    name,
    gender,
    date_of_birth,
    blood_group,
    contact_number,
    address,
    photo,
    about,
  } = req.body;

  // SQL query for updating user data based on email
  const query = `
    UPDATE users
    SET 
      name = COALESCE(?, name), 
      gender = COALESCE(?, gender), 
      date_of_birth = COALESCE(?, date_of_birth), 
      blood_group = COALESCE(?, blood_group), 
      contact_number = COALESCE(?, contact_number), 
      address = COALESCE(?, address), 
      photo = COALESCE(?, photo), 
      about = COALESCE(?, about)
    WHERE email = ?
  `;

  const values = [
    name || null,
    gender || null,
    date_of_birth || null,
    blood_group || null,
    contact_number || null,
    address || null,
    photo || null,
    about || null,
    email, // Use email in WHERE clause
  ];

  database.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Failed to update profile" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  });
});

// POST API for /users (google register)
app.post("/users", (req, res) => {
  const {
    name,
    email,
    photo, // Added photo to the destructured body
    user_type = "patient", // Default user type is patient
    last_login = new Date(),
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Check if the email already exists
  const checkQuery = "SELECT * FROM users WHERE email = ?";
  database.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking for existing user:", err);
      return res
        .status(500)
        .json({ error: "Failed to check for existing user" });
    }

    if (results.length > 0) {
      console.log(`Conflict: User with email ${email} already exists`);
      return res.status(409).json({ error: "Email already exists" });
    }

    // Insert user with the required fields, including photo (if available)
    const insertQuery = `
      INSERT INTO users (name, email, photo, user_type, last_login) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, email, photo, user_type, last_login]; // Include photo in the values

    database.query(insertQuery, values, (err, result) => {
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
});

// GET API for /doctors by pagination
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

// GET API for /admin-doctors (from admin dashboard)
app.get("/admin-doctors", (req, res) => {
  const query = `
      SELECT 
          id, 
          name, 
          email, 
          specialist, 
          totalExperience, 
          consultationFee, 
          rating, 
          workingIn, 
          bmdcNumber 
      FROM doctors
  `;

  database.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching doctors:", err);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }

    res.status(200).json(results);
  });
});

// DELETE API for /admin-doctors/:id (from admin dashboard)
app.delete("/admin-doctors/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Doctor ID is required" });
  }

  const query = "DELETE FROM doctors WHERE id = ?";
  database.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting doctor:", err);
      return res.status(500).json({ error: "Failed to delete doctor" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
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

// GET API for /appointments(from admin dashboard)
app.get("/appointments", (req, res) => {
  const query = "SELECT * FROM appointments";
  database.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }
    res.json(results);
  });
});

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

// GET API for /patients(from admin dashboard)
app.get("/patients", (req, res) => {
  const query = `
    SELECT user_id, name, gender, date_of_birth, blood_group, contact_number, email, address, user_type, photo, about 
    FROM users
    WHERE user_type = 'patient'
  `;

  database.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching patients:", err);
      return res.status(500).json({ error: "Failed to fetch patients" });
    }

    res.status(200).json(results);
  });
});

// DELETE API for /patients/:id (from admin dashboard)
app.delete("/patients/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Patient ID is required" });
  }

  const query = "DELETE FROM users WHERE user_id = ?";
  database.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting patient:", err);
      return res.status(500).json({ error: "Failed to delete patient" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  });
});

// GET API for /appointments(from patient dashboard)
app.get("/appointments", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM appointments WHERE patient_email = ?";
  database.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No appointments found for this patient" });
    }

    // Format the date and time fields
    const formattedResults = results.map((appointment) => {
      return {
        ...appointment,
        consultation_date: new Date(
          appointment.consultation_date
        ).toISOString(),
        consultation_time: new Date(
          `1970-01-01T${appointment.consultation_time}Z`
        ).toISOString(),
      };
    });

    res.status(200).json(formattedResults);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
