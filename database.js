const { Pool } = require("pg");

// Configure the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render's database URL
  ssl: {
    rejectUnauthorized: false, // Required for Render's PostgreSQL
  },
});

// Error handling for database connection
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Function to save a message to the database
const saveMessage = async (patientId, messageText) => {
  const query = `
    INSERT INTO "Message" (patientId, text, dateCreated)
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
  const query = 'SELECT * FROM "Message" ORDER BY "dateCreated" DESC;';

  try {
    // Log the exact connection details (be careful not to log sensitive info in production)
    console.log('Database URL:', process.env.DATABASE_URL);
    
    const res = await pool.query(query);
    
    // Log query results
    console.log('Query Results:', res.rows);
    
    return res.rows; // Return all messages
  } catch (err) {
    // More detailed error logging
    console.error("Error retrieving messages:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail
    });
    throw err;
  }
};

// Optional: Add a connection test function
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    console.log("Database connection successful", result.rows[0]);
    return true;
  } catch (err) {
    console.error("Database connection failed", err);
    return false;
  }
};

// Optional: Graceful shutdown of the connection pool
const shutdown = async () => {
  try {
    await pool.end();
    console.log("Database pool closed");
  } catch (err) {
    console.error("Error closing database pool", err);
  }
};

module.exports = {
  saveMessage,
  getAllMessages,
  testConnection,
  shutdown,
};
