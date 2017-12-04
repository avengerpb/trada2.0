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
    res.render('login.html');
});

router.post('/', (req, res) => {
	req.checkBody('email_uname', 'Email is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	// let bcrypt = require('bcryptjs');
	// let salt = bcrypt.genSaltSync(10);
	// let hash = bcrypt.hashSync(req.body.password, salt);

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
		}, (err, docs) => {
			if(err) throw err;
			if(!docs) {
				console.log("User doesn't exist");
				res.redirect('/');
			} else {
				let isSame = bcrypt.compareSync(req.body.password, docs.password);
				if(isSame == false){
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

module.exports = router;
