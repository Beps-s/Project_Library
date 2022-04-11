const con = require('../utils/db');

// show all objects - index page
const getAllObjects = (req, res) => {
	let query = "SELECT * FROM objects";
	let objects = []
	con.query(query, (err, result) => {
		if (err) throw err;
		objects = result
		res.render('index', {
			objects: objects
		})
	})
};

// export controller functions
module.exports = {
	getAllObjects
};