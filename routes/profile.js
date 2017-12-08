const express = require("express");
const router = express.Router();
const passport = require('passport');
const mongojs = require('mongojs');
const bcrypt = require('bcryptjs');

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
	// console.log(req.session);
	res.render('edit_profile.html', {user: req.session.user, message: req.flash('message')});
});
//END EDIT PAGE


//UPDATE USER INFO
router.post('/:id/edit', isLoggedIn, (req, res, next) => {
	let info = req.body;
	
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
			req.flash('message', 'Info updated successfully!');
			let session = req.session.user;
			session.fullname = info.fullname;
			session.username = info.username;
			session.email = info.email;
			res.redirect(`/profile/${session._id}/edit`);
		}
	);
});
//END UPDATE USER INFO


//CHANGE USER PASSWORD
router.get('/:id/edit/new_pwd', isLoggedIn, (req, res, next) => {
	res.render('new_password.html', {user: req.session.user, message: req.flash('message')});
});

router.post('/:id/edit/new_pwd', isLoggedIn, (req, res, next) => {
	req.checkBody('old_pwd', 'Enter your current password').notEmpty();
	req.checkBody('new_pwd', 'Enter your new password').notEmpty();
	req.checkBody('cnew_pwd', 'Confirm your new password').notEmpty();
	req.assert('cnew_pwd', 'Confirm password does not match').equals(req.body.new_pwd);

	let errors = req.validationErrors();
	if(errors) {
		res.render('new_password.html', {
			errors: errors
		});
	} else {
		let session = req.session.user;
		let checkPass = bcrypt.compareSync(req.body.old_pwd, session.password);
		if(checkPass == false) {
			console.log('Wrong current password!');
			res.redirect('/');
		} else {
			if(req.body.old_pwd == req.body.new_pwd){
				console.log('New password must be different from the old one!');
				req.flash('message', 'Your new password is similar to the old one!');
				res.redirect(`/profile/${session._id}/edit/new_pwd`);
			} else {
				let salt = bcrypt.genSaltSync(10);
				let hash = bcrypt.hashSync(req.body.new_pwd, salt);
				db.User.update(
					{ _id: mongojs.ObjectId(req.params.id)}, 
					{
						$set: {
							password: hash
						}	
					}, (err, docs) => {
						if(err) throw err;
						console.log('Password has been changed!');
						req.flash('message', 'Your password has been changed!');
						session.password = hash;
						res.redirect(`/profile/${session._id}/edit/new_pwd`);
					}
				);
			}
		}
	}
});
//END CHANGE USER PASSWORD

module.exports = router;
