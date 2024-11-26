const { Pool } = require("pg");

// Create a new pool instance to connect to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER, // Your database user
  host: process.env.DB_HOST, // Your database host
  database: process.env.DB_NAME, // Your database name
  password: process.env.DB_PASSWORD, // Your database password
  port: process.env.DB_PORT, // Your database port
});

// Function to save a message to the database
const saveMessage = async (patientId, messageText) => {
  const query = `
    INSERT INTO \"Message\" (patientId, text, dateCreated)
    VALUES ($1, $2, NOW())
    RETURNING *;
  `;

  const values = [patientId, messageText];

  try {
    const res = await pool.query(query, values);
    return res.rows[0]; // Return the newly created message
  } catch (err) {
    console.error("Error saving message:", err);
    throw err;
  }
};

// Function to get all messages from the database
const getAllMessages = async () => {
  const query = "SELECT * FROM \"Message\";";

  try {
    const res = await pool.query(query);
    return res.rows; // Return all messages
  } catch (err) {
    console.error("Error retrieving messages:", err);
    throw err;
  }
};

module.exports = {
  saveMessage,
  getAllMessages,
};
