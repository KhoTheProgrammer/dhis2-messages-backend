// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { saveMessage, getAllMessages, testConnection } = require("./database");

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors());

app.use(bodyParser.json());

// Logging middleware (helpful for debugging in production)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// POST request to save a message
app.post("/api/messages", async (req, res) => {
  const { patientId, message } = req.body;

  if (!patientId || !message) {
    return res
      .status(400)
      .json({ error: "Patient ID and message are required" });
  }

  try {
    const newMessage = await saveMessage(patientId, message);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Message save error:", err);
    res.status(500).json({ error: "Failed to save message" });
    console.log(err.message)
  }
});

// GET request to retrieve all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    console.error("Messages retrieval error:", err);
    res.status(500).json({ error: "Failed to retrieve messages" });
    console.log(err.message);
    
  }
});

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Test database connection
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Database connection failed");
    }
  } catch (error) {
    console.error("Error testing database connection", error);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
