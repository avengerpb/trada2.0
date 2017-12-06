const express = require("express");
const router = express.Router();
const passport = require('passport');
const mongojs = require('mongojs');

let db = mongojs('mongodb://sieunhan:trada1234@ds127978.mlab.com:27978/trada', ['User']);

//CHECK LOGGED IN
let isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated() || req.session.user){
		return next();
	}
	res.redirect('/');
}
//END CHECK LOGGED IN


//PROFILE PAGE
router.get('/:id', isLoggedIn, (req, res, next) => {
	// console.log(req.session);
	db.User.findOne({
		_id: mongojs.ObjectId(req.params.id)
	}, (err, user) => {
		if(err) throw err;
		if(user){
			res.render('profile.html', {user: user});
		} else {
			res.redirect('/login');
		}
	});
});
//END PROFILE PAGE


//EDIT PAGE
router.get('/:id/edit', isLoggedIn, (req, res) => {
	res.render('edit_profile.html', {user: req.session.user, update_msg: req.flash('update_msg')});
});
//END EDIT PAGE


//UPDATE USER INFO
router.post('/:id/edit', isLoggedIn, (req, res, next) => {
	let info = req.body;
	let session = req.session.user;
	session.fullname = info.fullname;
	session.username = info.username;
	session.email = info.email;
	
	db.User.update(
		{ _id: mongojs.ObjectId(req.params.id)}, 
		{
			$set: {
				fullname: info.fullname,
				username: info.username,
				email: info.email
			}	
		}, (err, docs) => {
			if(err) throw err;
			req.flash('update_msg', 'Info updated successfully!')
			res.redirect(`/profile/${session._id}/edit`);
		}
	);
});
//END UPDATE USER INFO

module.exports = router;
