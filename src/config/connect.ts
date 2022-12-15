const mysql = require('mysql2');

// create connection
// const pool = () =>{
  const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });
//   return pool
// }

module.exports = pool
