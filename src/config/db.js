const Pool = require('pg').Pool;

const pass_db = process.env.PASS_DB;
const user_db = process.env.USER_DB;
const db = process.env.DB;
const host = process.env.HOST;

const pool = new Pool({
  user: user_db,
  host: host,
  database:db,
  password: pass_db,
  port: 5432,
});



module.exports={pool}

