const { Pool } = require('pg');
const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: false, // set true only if you know you need SSL
});
module.exports = pool;
