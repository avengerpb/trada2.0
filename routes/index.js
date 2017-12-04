const express = require("express");
const router = express.Router();
const passport = require('passport');
const FbStrategy = require('passport-facebook').Strategy;
const expressSession = require('express-session');
const mongojs = require('mongojs');
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');

let db = mongojs('mongodb://sieunhan:trada1234@ds127978.mlab.com:27978/trada', ['User']);


//FACEBOOK LOGIN
const FACEBOOK_APP_ID ='1943048642627190',
	  FACEBOOK_APP_SECRET = '348d34c6bff7b6077e455d474142deeb';

let fbOption = {
	'clientID': FACEBOOK_APP_ID,
	'clientSecret': FACEBOOK_APP_SECRET,
	'callbackURL': 'http://localhost:8000/auth/facebook/callback',
	'profileFields': ['id', 'displayName', 'photos', 'emails', 'profileUrl']
};

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

router.use(expressSession({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

let fbCallback = (accessToken, refreshToken, profile, cb) => {
	return cb(null, profile);
};

passport.use(new FbStrategy(fbOption, fbCallback));

router.get('/', (req, res, next) => {
    res.render('index.html', {user: req.user});
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));

router.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
	let user = req.user;
	let newUser = {
		facebook_id: user.id,
		username: user.displayName,
		email: user.emails[0].value,
		fblink: user.profileUrl,
		avatar: user.photos[0].value,
		user_type: 'Facebook'
	}
	db.User.findOne({
		'facebook_id': user.id
	}, (err, docs) => {
		if(err) throw err;
		if(!docs) {
			db.User.insert(newUser, (err, user) => {
				if(err) { throw err; }
				// res.json(user);
			});
			res.redirect('/');
		} else {
			res.redirect('/');
		}
	});
});
//END FACEBOOK LOGIN


//LOCAL LOGIN
//global variable
router.use(function(req, res, next){
	res.locals.errors = null;
	next();
})

// express validator
router.use(expressValidator({
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

router.get('/login', (req, res, next) => {
    res.render('login.html');
});

router.post('/login', (req, res) => {
	req.checkBody('email_uname', 'Email or Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	let errors = req.validationErrors();
	if(errors) {
		res.render('login.html', {
			errors: errors
		});
	} else {
		db.User.findOne({
			$or: [
				{'email': req.body.email_uname},
				{'username': req.body.email_uname}
			]
		}, (err, user) => {
			if(err) throw err;
			if(!user) {
				console.log("User doesn't exist");
				res.redirect('/');
			} else {
				let checkPass = bcrypt.compareSync(req.body.password, user.password);
				if(checkPass == false){
					console.log('Wrong password!');
					res.redirect('/');
				} else {
					console.log('Logged in');	
					res.redirect('/');
				}
			}
		});
	}
});
//END LOCAL LOGIN


//USER REGISTER
router.get('/register', (req, res, next) => {
    res.render('register.html');
});

router.post('/register', (req, res) => {
	req.checkBody('username', 'User name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'This email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.assert('cpassword', 'Passwords do not match').equals(req.body.password);

	// let bcrypt = require('bcryptjs');
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(req.body.password, salt);

	let errors = req.validationErrors();
	if(errors) {
		res.render('register.html', {
			errors: errors
		});
	} else {
		let newUser = {
			username: req.body.username,
			email: req.body.email,
			password: hash,
			user_type: 'Normal'
		}
		db.User.insert(newUser, (err, user) => {
			if(err) { throw err; }
			res.json(user);
		});
		console.log('SUCCESS');
	}
});
//END USER REGISTER


//LOGOUT
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
	console.log('LOGGED OUT');
});
//END LOGOUT

module.exports = router;
