const con = require('../utils/db');

// show all objects - index page
const getAllObjects = (req, res) => {
	let sess = req.session;
	let query = "SELECT * FROM objects";
	let objects = []
	con.query(query, (err, result) => {
		if (err) throw err;
		objects = result;
		objects.forEach((object) => {object['login'] = sess.loggedin})
		res.render('index', {
			objects: objects, loggedIn: sess.loggedin
		})
	})
};

// loan books
const loanBook = (req, res) => {
	let book_id = parseInt(req.body.UID);
	let user_id = req.session.uid;
	con.query('UPDATE objects SET Loaned = Loaned + 1 WHERE UID = ?', [book_id])
	con.query(`INSERT INTO loans (Start, End, Member_id, Book_id) VALUES (CURDATE(), date_add(CURDATE(), interval 14 day), '${user_id}', '${book_id}')`)
	res.redirect('/');
}

// export controller functions
module.exports = {
	getAllObjects,
	loanBook
};