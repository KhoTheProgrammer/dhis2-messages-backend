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
        "patientId" INTEGER NOT NULL,
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

async function alterColumnToVarchar() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE "Message"
      ALTER COLUMN "patientId" TYPE VARCHAR(255) USING "patientId"::VARCHAR(255);
    `);
    console.log("Column altered to VARCHAR successfully");
  } catch (err) {
    console.error("Error altering column to VARCHAR", err);
  } finally {
    client.release();
  }
}

alterColumnToVarchar()
  .then(() => pool.end())
  .catch(console.error);
