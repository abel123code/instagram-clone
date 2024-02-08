// database/db.js
const mysql = require('mysql');

//establish db connection 
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.SQL_PASSWORD,
  database: "instagramreact",
  port: 3306
});


db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = db;
