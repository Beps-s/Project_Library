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
	layoutsDir: __dirname + '/views/layouts/'
}))

// setup static assets directory
app.use(express.static('assets'))

const objectsRoutes = require('./routes/objects'); // import objects route

app.use('/', objectsRoutes);

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
				request.session.loggedin = true;
				request.session.username = email;
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
app.post('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

// app start point
app.listen(8080, () => {
	console.log('App is started at http://localhost:8080')
});