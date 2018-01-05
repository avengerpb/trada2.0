let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
// let passport = require('passport');
let mongojs = require('mongojs');
let db = mongojs('mongodb://sieunhan:trada1234@ds127978.mlab.com:27978/trada', ['User']);

module.exports = (passport) => {
	let opts = {};
	opts.jwtFromRequest  = ExtractJwt.fromAuthHeaderWithScheme("jwt");
	opts.secretOrKey = 'secret';
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		db.User.findOne({
			id: jwt_payload.sub
		}, (err, user) => {
			if(err) {
				return done(err, false);
			}
			if(user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	}));
}
