const express = require("express");
const router = express.Router();
const passport = require('passport');
const expressSession = require('express-session');
const mongojs = require('mongojs');
const expressValidator = require('express-validator');
const bcrypt = require('bcryptjs');

let db = mongojs('mongodb://sieunhan:trada1234@ds127978.mlab.com:27978/trada', ['User']);


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

router.get('/', (req, res, next) => {
    res.render('register.html');
});

router.post('/new', (req, res) => {
	req.checkBody('username', 'User name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'This email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	let bcrypt = require('bcryptjs');
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
			password: hash
		}
		db.User.insert(newUser, (err, user) => {
			if(err) { throw err; }
			res.json(user);
		});
		console.log('SUCCESS');
	}
});

module.exports = router;
