import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  port: process.env.PG_PORT || 5432,
  ssl: process.env.PG_SSL === "true", // Render requires SSL
});

export default pool;

// // db.js
// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const connection = await mysql.createConnection(process.env.DATABASE_URL);

// export default connection;

// db.js
