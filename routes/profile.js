const express = require("express");
const router = express.Router();
const passport = require('passport');
const FbStrategy = require('passport-facebook').Strategy;
const expressSession = require('express-session');
const mongojs = require('mongojs');
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');
// const check = require("./index.js");

let db = mongojs('mongodb://sieunhan:trada1234@ds127978.mlab.com:27978/trada', ['User']);

//CHECK LOGGED IN
let isLoggedIn = (req, res, next) => {
	if(req.session){
		return next();
	}
	res.redirect('/');
}
//END CHECK LOGGED IN


//PROFILE PAGE
router.get('/:username', isLoggedIn, (req, res, next) => {
	db.User.findOne({
		username: req.params.username
	}, (err, user) => {
		if(err) throw err;
		if(user){
			res.render('profile.html', {user: user});
		} else {
			res.redirect('/login');
		}
	});
});

module.exports = router;
