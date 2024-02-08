// database/db.js
const mysql = require('mysql');

//establish db connection 
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});


db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = db;
