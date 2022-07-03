const { Pool } = require("pg");
require("dotenv").config();

//creating a new pool with the connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
