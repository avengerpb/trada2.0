const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressSession = require('express-session');
const flash = require('connect-flash');
// const mongojs = require("mongojs");
const expressValidator = require("express-validator");

let index = require("./routes/index");
let profile = require("./routes/profile");
let app = express();
app.set('port', (process.env.PORT || 8000));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

//Set static path
app.use(express.static(path.join(__dirname, 'client')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//session handling
app.use(expressSession({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

//connect-flash
app.use(flash());

// express validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		let namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;
		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		}
	}
}));	

//global variable
app.use(function(req, res, next){
	res.locals.errors = null;
	res.locals.register_messages = req.flash('register_messages');
	res.locals.update_msg = req.flash('update_msg');
	next();
})

app.use('/', index);
app.use('/profile', profile);

app.listen(app.get('port'), function() {
  console.log(`Node app is running at port: ${app.get('port')}`);
});
