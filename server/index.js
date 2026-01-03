import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { User } from "./models/User.js";
import { Contact } from "./models/Contact.js";
import csv from "csv-parser";
import { Readable } from "stream";
import multer from "multer";

dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/contact_manager",
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    if (file.mimetype !== "text/csv") {
      cb(new Error("Only CSV files allowed"));
    }
    cb(null, true);
  },
});

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://contact-manager-xi-henna.vercel.app",
      "https://contact-manager-mu0c.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Auth middleware helper
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/upload/users-file", authenticateToken, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file is required" });
  }

  const contacts = [];
  const errors = [];

  try {
    // Get the authenticated user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (row) => {
        const name = row.name?.trim();
        const email = row.email?.trim();
        const phone = row.phone?.trim();
        const message = row.message?.trim() || "";

        if (!name || !phone) {
          errors.push({ row, error: "Missing required fields (name and phone)" });
          return;
        }

        contacts.push({ 
          userId: user._id,
          name, 
          email: email || "", 
          phone, 
          message 
        });
      })
      .on("end", async () => {
        if (contacts.length === 0) {
          return res.status(400).json({
            error: "No valid rows found",
            errors,
          });
        }

        try {
          const result = await Contact.insertMany(contacts, {
            ordered: false, // continues on duplicates
          });

          return res.status(201).json({
            message: "Contacts imported successfully",
            inserted: result.length,
            failed: errors.length,
            errors: errors.length > 0 ? errors : undefined,
          });
        } catch (dbErr) {
          return res.status(207).json({
            message: "Partial success",
            inserted: contacts.length - errors.length,
            dbError: dbErr.message,
            errors,
          });
        }
      })
      .on("error", (streamErr) => {
        return res.status(500).json({ error: "Error processing CSV: " + streamErr.message });
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/deleteContacts", authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    await Contact.deleteMany({ _id: { $in: ids }, userId: user._id });
    res.json({
      message: "Contacts deleted successfully.",
      ok: true,
      status: 200,
    });
    console.log("Contacts deleted:", ids);
  } catch (error) {
    console.error("Error deleting contacts:", error);
    res.status(500).json({ error: "Failed to delete contacts" });
  }
});

app.post("/api/newuser", async (req, res) => {
  try {
    const { name, email, image } = req.body;
    console.log("New user data received:", req.body);

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    // Check if user with email already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      const newId = Date.now();
      user = await User.create({
        _id: newId,
        username: name,
        email,
        image: image || null,
      });
      console.log("New user created:", user);
    } else {
      // Update existing user's image if provided
      if (image && user.image !== image) {
        user.image = image;
        await user.save();
        console.log("User image updated:", user);
      } else {
        console.log("Existing user found:", user);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Set JWT as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: user ? "User logged in" : "User created",
      user: {
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error in /api/newuser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/createContact", authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required." });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const newContact = await Contact.create({
      userId: user._id,
      name,
      email: email || "",
      phone,
      message: message || "",
    });

    res.status(201).json({
      id: newContact._id,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      message: newContact.message,
    });
    res.redirect("/");
    console.log("New contact created:", newContact);
  } catch (error) {
    res.status(500).json({ error: "Failed to create contact." });
    console.error("Error creating contact:", error);
  }
});

// Get all contacts for authenticated user
app.get("/api/contacts", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const contacts = await Contact.find({ userId: user._id });
    res.json(
      contacts.map((c) => ({
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        message: c.message,
      })),
    );
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// Export contacts as CSV
app.get("/api/contacts/export", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const contacts = await Contact.find({ userId: user._id });

    if (contacts.length === 0) {
      return res.status(404).json({ error: "No contacts to export" });
    }

    // Create CSV content
    const csvHeader = "name,email,phone,message\n";
    const csvRows = contacts
      .map((contact) => {
        const name = `"${contact.name.replace(/"/g, '""')}"`;
        const email = `"${(contact.email || "").replace(/"/g, '""')}"`;
        const phone = `"${contact.phone.replace(/"/g, '""')}"`;
        const message = `"${(contact.message || "").replace(/"/g, '""')}"`;
        return `${name},${email},${phone},${message}`;
      })
      .join("\n");

    const csv = csvHeader + csvRows;

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="contacts_${Date.now()}.csv"`,
    );

    res.send(csv);
  } catch (error) {
    console.error("Error exporting contacts:", error);
    res.status(500).json({ error: "Failed to export contacts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
