// setup database connection
const mysql = require('mysql');

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "qwerty",
	database: "library"
});

module.exports = db;