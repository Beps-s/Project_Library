// application packages
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// add template engine
const hbs = require('express-handlebars');
// setup template engine directory and files extensions
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/'
}));

// app start point
app.listen(8080, () => {
	console.log('App is started at http://localhost:8080')
});