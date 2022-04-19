const con = require('../utils/db');

// show all objects - index page
const getAllObjects = (req, res) => {
	let sess = req.session
	console.log(sess)
	let query = "SELECT * FROM objects";
	let objects = []
	con.query(query, (err, result) => {
		if (err) throw err;
		objects = result;
		objects.forEach((object) => {object['login'] = sess.loggedin})
		// objects.push({login: req.session.loggedin})
		console.log(objects)
		res.render('index', {
			objects: objects, loggedIn: sess.loggedin
		})
	})
};

// export controller functions
module.exports = {
	getAllObjects
};