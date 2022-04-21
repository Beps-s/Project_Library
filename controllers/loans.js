const con = require('../utils/db');

// show all loans
const getAllLoans = (req, res) => {
	let sess = req.session;
    let user_id = req.session.uid;
	let query = `SELECT loans.UID, loans.Member_id, loans.start, DATE_FORMAT(loans.end, '%a %d %b %Y') as end, objects.UID as bk_id, objects.Image, objects.Name, objects.Author FROM loans INNER JOIN objects ON loans.Book_id = objects.UID WHERE Member_id = '${user_id}'`;
	let loans = []
	con.query(query, (err, result) => {
		if (err) throw err;
		loans = result;
		console.log(loans)
		loans.forEach((object) => {object['login'] = sess.loggedin})
		// loans.push({login: req.session.loggedin})
        //console.log(loans)
		res.render('profile', {
			loans: loans, loggedIn: sess.loggedin
		})
	})
};

// return a book
const returnLoan = (req, res) => {
	let loan_id = parseInt(req.body.UID);
	let bk_id = parseInt(req.body.bk_id)
	let user_id = req.session.uid;
	//console.log(bk_id)
	con.query('UPDATE objects SET Loaned = Loaned - 1 WHERE UID = ?', [bk_id])
	con.query(`DELETE FROM loans WHERE UID = ?`, [loan_id])
	res.redirect('/profile');
}

// export controller functions
module.exports = {
	getAllLoans,
	returnLoan
};