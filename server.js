let express = require("express");
let bodyParser = require("body-parser");
let path = require("path");
let expressSession = require('express-session');
let cookieParser = require('cookie-parser');
let flash = require('express-flash-2');
let expressValidator = require("express-validator");
let passport = require('passport');

let index = require("./routes/index");
let profile = require("./routes/profile");
let market = require("./routes/market");
let cors = require('cors');
let app = express();
app.set('port', (process.env.PORT || 8000));
app.use(cors());

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

//Set static path
app.use(express.static(path.join(__dirname, 'client')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//cookie parser
app.use(cookieParser('secret'));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

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
app.use((req, res, next) => {
	res.locals.errors = null;
	// res.locals.signupMsgs = res.flash('signupMsg');
	// res.locals.editMsgs = res.flash('editMsgs');
	next();
});

app.use('/', index);
app.use('/profile', profile);
app.use('/market', market);

app.listen(app.get('port'), function() {
  console.log(`Node app is running at port: ${app.get('port')}`);
});
