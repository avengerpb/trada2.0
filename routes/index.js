const express = require("express");
const router = express.Router();
const passport = require('passport');
const FbStrategy = require('passport-facebook');
// const mongojs = require('mongojs');

const FACEBOOK_APP_ID ='1943048642627190',
	  FACEBOOK_APP_SECRET = '348d34c6bff7b6077e455d474142deeb';

let fbOption = {
	'clientID': FACEBOOK_APP_ID,
	'clientSecret': FACEBOOK_APP_SECRET,
	'callbackURL': 'http://localhost:8000/auth/facebook/callback'
	// 'profileFields': ['id', 'displayName', 'photos', 'email']
};

let fbCallback = (accessToken, refreshToken, profile, cb) => {
	console.log(accessToken, refreshToken, profile);
};

passport.use(new FbStrategy(fbOption, fbCallback));

router.get('/', (req, res, next) => {
    res.render('index.html');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook'), (req, res) => {
	res.redirect('/');
});

module.exports = router;