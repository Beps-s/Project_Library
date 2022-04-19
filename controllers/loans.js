const con = require('../utils/db');

// show all loans
const getAllLoans = (req, res) => {
	let sess = req.session;
    let user_id = req.session.uid;
	let query = `SELECT loans.UID, loans.Member_id, loans.start, loans.end, objects.UID as bk_id, objects.Image, objects.Name, objects.Author FROM loans INNER JOIN objects ON loans.Book_id = objects.UID WHERE Member_id = '${user_id}'`;
	let loans = []
	con.query(query, (err, result) => {
		if (err) throw err;
		loans = result;
		loans.forEach((object) => {object['login'] = sess.loggedin})
		// loans.push({login: req.session.loggedin})
        //console.log(loans)
		res.render('profile', {
			loans: loans, loggedIn: sess.loggedin
		})
	})
};

// export controller functions
module.exports = {
	getAllLoans
};