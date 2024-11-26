const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Message" (
        id SERIAL PRIMARY KEY,
        "patientId" VARCHAR(24) NOT NULL,
        text TEXT NOT NULL,
        "dateCreated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    client.release();
  }
}

createTables()
  .then(() => pool.end())
  .catch(console.error);
