// application packages
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session');
var con = require('./utils/db')
// const con = require('/utils/db/');
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// add template engine
const hbs = require('express-handlebars');
// setup template engine directory and files extensions
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/',
	helpers: {
		// Function to do basic mathematical operation in handlebar
		math: function(lvalue, operator, rvalue) {
			lvalue = parseFloat(lvalue);
			rvalue = parseFloat(rvalue);
			return {
				"+": lvalue + rvalue,
				"-": lvalue - rvalue,
				"*": lvalue * rvalue,
				"/": lvalue / rvalue,
				"%": lvalue % rvalue
			}[operator];},
		sessionStatus: (req, res) => {
			return req.session.loggedin
		}
}}));

// setup static assets directory
app.use(express.static('assets'))

const objectsRoutes = require('./routes/objects'); // import objects route
const loansRoutes = require('./routes/loans'); // import loans route

app.use('/', objectsRoutes);
app.use('/profile', loansRoutes);

var sess;

// login auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let email = request.body.email;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		con.query('SELECT * FROM members WHERE Mail = ? AND Password = ?', [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				sess = request.session;
				request.session.loggedin = true;
				request.session.username = email;
				request.session.uid = results[0].UID
				// Redirect to home page
				response.redirect('/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// logout
app.post('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

// borrow objects
app.post('/borrow', (req, res) => {
	let book_id = parseInt(req.body.UID);
	let user_id = req.session.uid;
	con.query('UPDATE objects SET Loaned = Loaned + 1 WHERE UID = ?', [book_id])
	con.query(`INSERT INTO loans (Start, End, Member_id, Book_id) VALUES (CURDATE(), date_add(CURDATE(), interval 14 day), '${user_id}', '${book_id}')`)
	res.redirect('/');
});

// return objects
app.post('/profile/return', (req, res) => {
	let loan_id = parseInt(req.body.UID);
	let bk_id = parseInt(req.body.bk_id)
	let user_id = req.session.uid;
	//console.log(bk_id)
	con.query('UPDATE objects SET Loaned = Loaned - 1 WHERE UID = ?', [bk_id])
	con.query(`DELETE FROM loans WHERE UID = ?`, [loan_id])
	res.redirect('/profile');
});

// app start point
app.listen(8080, () => {
	console.log('App is started at http://localhost:8080')
});