const express = require("express");
const router = express.Router();
const passport = require('passport');
const FbStrategy = require('passport-facebook').Strategy;
const expressSession = require('express-session');
// const mongojs = require('mongojs');

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
	res.redirect('/');
});

module.exports = router;
