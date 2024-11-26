// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { saveMessage, getAllMessages } = require("./database"); // Import the database functions

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
    res.status(500).json({ error: "Failed to save message" });
  }
});

// GET request to retrieve all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve messages" });
    console.log(err);
    
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
