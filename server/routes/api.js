var express = require('express'),
    router = express.Router(),
    passport = require('passport');
    User = require('../models/user.js');
    UserDetails = require('../models/userDetails.js');


router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({err: err});
    }
    passport.authenticate('local')(req, res, function () {
    	var userDetail = new UserDetails({
    		  name: req.body.detail.name,
    		  username: req.body.username,
    		  name: req.body.detail.email,
    		  admin: false,
    		  details: req.body.detail.details,
    		  age: req.body.detail.age    		  
    		});
    	userDetail.save(function(err) {
    		  if (err) throw err;
    		  console.log('User Details saved successfully!');
    		});
      return res.status(200).json({status: 'Registration successful!'});
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({err: err});
    }
    if (!user) {
      return res.status(401).json({err: info});
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({err: 'Could not log in user'});
      }
      UserDetails.find({username:user.username}, function(err, details) {
		  if (err) throw err;
		  console.log("User logged in with username : "+ user.username + " | Is Admin : "+details[0].admin);
		  res.status(200).json({status: 'Login successful!', userdetails: details[0]});
		});
      
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'});
});

router.get('/userDetails', function(req, res) {
	// get all the users
	UserDetails.find({}, function(err, userDetails) {
	  if (err) throw err;

	  // object of all the users
	  res.status(200).json(userDetails);
	});
});

module.exports = router;