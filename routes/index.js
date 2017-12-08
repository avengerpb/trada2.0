let express = require("express");
let router = express.Router();
let passport = require('passport');
let FbStrategy = require('passport-facebook').Strategy;
let mongojs = require('mongojs');
let bcrypt = require('bcryptjs');

let db = mongojs('mongodb://sieunhan:trada1234@ds127978.mlab.com:27978/trada', ['User']);
let session;

//FACEBOOK LOGIN
let FACEBOOK_APP_ID ='1943048642627190',
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


router.use(passport.initialize());
router.use(passport.session());


let fbCallback = (accessToken, refreshToken, profile, cb) => {
	return cb(null, profile);
};

passport.use(new FbStrategy(fbOption, fbCallback));

router.get('/', (req, res, next) => {
	session = req.session;
	res.render('index.html', {user: session.user});
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));

router.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
	let user = req.user;
	let newUser = {
		username: user.id,
		fullname: user.displayName,
		email: user.emails[0].value,
		fblink: user.profileUrl,
		avatar: user.photos[0].value,
		user_type: 'Facebook'
	}
	db.User.findOne({
		'username': user.id
	}, (err, docs) => {
		if(err) throw err;
		if(!docs) {
			db.User.insert(newUser, (err, user) => {
				if(err) { throw err; }
				// res.json(user);
			});
			res.redirect('/');
		} else {
			session = req.session;
			session.user = docs;
			// console.log(req.session);
			res.redirect('/');
		}
	});
});
//END FACEBOOK LOGIN


//LOCAL LOGIN
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
					session = req.session;
					session.user = user;	
					res.redirect('/');
				}
			}
		});
	}
});
//END LOCAL LOGIN


//USER REGISTER
router.get('/register', (req, res, next) => {
	// console.log(req.session);
    res.render('register.html', {signupMsgs: req.flash('signupMsgs')});
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
		db.User.findOne({
			$or: [
				{'username': req.body.username},
				{'email': req.body.email}
			]
		}, (err, user) => {
			if(err) throw err;
			if(!user) {
				db.User.insert(newUser, (err, user) => {
					if(err) { throw err; }
					console.log('Registration succeed!');
					req.flash('signupMsgs', 'Registration succeed!');
					res.redirect('/');
				});
			} else {
				if(user.username == req.body.username) {
					console.log('This username has already existed!');
					req.flash('signupMsgs', 'This username has already existed!');
					res.redirect('/register');
				}
				if(user.email == req.body.email){
					console.log('This email has already existed!');
					req.flash('signupMsgs', 'This email has already existed!');
					res.redirect('/register');
				}
			}
		});
	}
});
//END USER REGISTER


//LOGOUT
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
	  if(err) {
	    throw err;
	  } else {
	    res.redirect('/');
	  }
	});
});
//END LOGOUT

module.exports = router;
