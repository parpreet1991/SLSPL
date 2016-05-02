var express = require('express');
var router = express.Router();
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/user.js');
var UserDetails = require('../models/userDetails.js');


router.post('/validateForgotPassword', function(req, res) {
	console.log("Start forgotPassword");
	/*req.check('usename', 'Email is not valid').isEmail();
	req.check('password', 'Password must be at least 4 characters long').len(4);
	req.check('confirmPassword', 'Passwords do not match').equals(req.body.password);
	req.sanitize('username').normalizeEmail();
	console.log("fields validated");
	 var errors = req.validationErrors();
	 if(errors){
		 return res.status(500).json({err: errors});
	 }*/
	User.find({username: req.body.username, passwordRegisterToken:req.body.token}, function(err, user) {
	    if (err) {
	    	return res.status(500).json({message: 'Token is invalid or has expired.'});
	    }
	    User.update(
    		{username: req.body.username },
    		{ $set : {password: req.body.password, passwordResetToken : undefined}},
    		function(err, result){
    			if(err) res.status(500).json({err: err});
    			res.status(200).json({status: 'Password reset is successs, please login now.'});
    		}
    	);
	  });	 

 	/*User.register(user, req.body.password, function(err, account) {
 	    if (err) {
 	      return res.status(500).json({err: err});
 	    }
 	    passport.authenticate('local')(req, res, function () {
 	    	res.status(200).json({status: 'Registration successfull! ' +'Validation link is sent to ' + user.username });
 	    });
 	  });*/
  
});

router.get('/forgotPassword', function(req, res) {
	console.log("Start forgotPassword");
	/*req.check('usename', 'Email is not valid').isEmail();
	req.check('password', 'Password must be at least 4 characters long').len(4);
	req.check('confirmPassword', 'Passwords do not match').equals(req.body.password);
	req.sanitize('username').normalizeEmail();
	console.log("fields validated");
	 var errors = req.validationErrors();
	 if(errors){
		 return res.status(500).json({err: errors});
	 }*/
	User.find({username: req.query.username}, function(err, user) {
	    if (err) {
	    	return res.status(500).json({message: 'User does not exist.'});
	    }
	    
	    async.waterfall([
	           	      function(done) {
	           	        crypto.randomBytes(16, function(err, buf) {
	           	          var token = buf.toString('hex');
	           	          done(err, token);
	           	        });
	           	      },
	           	      function(token, done) {
	           	          user.passwordResetToken = token;
	           	          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
	           	          console.log("token generated : "+token);
	           	          
	           	          console.log("Preparing email process");		        
	           		        
	           		        var smtpTransport = nodemailer.createTransport("SMTP", {
	           		        	  service: "Gmail",
	           		        	  auth: {
	           		        	    XOAuth2: {
	           		        	      user: "ajitsangwan2006@gmail.com", // Your gmail address.
	           		        	                                            // Not @developer.gserviceaccount.com
	           		        	      clientId: "249105079815-2khvuvp0t2ut7kpj59rtthh3b9an3pod.apps.googleusercontent.com",
	           		        	      clientSecret: "Lz765CtEI44k1TcrCdivCmlO",
	           		        	      refreshToken: "1/Be_Z3-NVqH8mylDyNLiJomG8o669vCcYml2meEyP5_8MEudVrK5jSpoR30zcRFq6"
	           		        	    }
	           		        	  }
	           		        	});

	           		        	var mailOptions = {
	           		        	  from: "ajitsangwan2006@gmail.com",
	           		        	  to: user.username,
	           		        	  subject: "Password reset from Silver Leaf Solutions",
	           		        	  generateTextFromHTML: true,
	           		        	  html: '<b>You are receiving this email because you (or someone else) have registered on Silver Leaf Solutions portal.\n\n' +
	           			            'Please click on the following link, or paste this into your browser to complete the password reset process:\n\n' +
	           			            'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
	           			            'If you did not request this, please ignore this email.</b>\n'
	           		        	};

	           		        	smtpTransport.sendMail(mailOptions, function(error, response) {
	           		        	  if (error) {
	           		        	    console.log(error);
	           		        	  } else {
	           		        	    console.log(response);
		           		        	 User.update(
		           		          		{username : req.query.username },
		           		          		{ $set : {passwordResetToken : token, passwordResetExpires: Date.now() + 3600000}},
		           		          		function(err, result){
		           		          			if(err) res.status(500).json({err: err});
		           		          		}
		           		          	);
	           		        	  }
	           		        	  smtpTransport.close();
	           		        	});
	           		        
	           		        
	           	          
	           	      }/*,
	           	      function(token, user, done) {
	           	    	  
	           	      }*/
	           	    ], function(err) {
	           	      if (err) {
	           	    	  res.status(500).json({err: err});
	           	      }
	           	    });
	    res.status(200).json({status: 'Password reset link is sent to ' + user.username });
	    
	  });
  
});



router.get('/register', function(req, res) {
	console.log("token = "+req.query.token);
	User.find({passwordRegisterToken:req.query.token}, function(err, user) {
	    if (err) {
	    	return res.status(500).json({message: 'Registeration token is invalid or has expired.'});
	    }
	    User.update(
    		{passwordRegisterToken : req.query.token },
    		{ $set : {passwordRegisterToken : undefined}},
    		function(err, result){
    			if(err) res.status(500).json({err: err});
    		}
    	);
	  });
	  res.status(200).json({message: 'Registeration process is completed, please login now.'});
});

router.post('/register', function(req, res) {
	console.log("Start");
	/*req.check('usename', 'Email is not valid').isEmail();
	req.check('password', 'Password must be at least 4 characters long').len(4);
	req.check('confirmPassword', 'Passwords do not match').equals(req.body.password);
	req.sanitize('username').normalizeEmail();
	console.log("fields validated");
	 var errors = req.validationErrors();
	 if(errors){
		 return res.status(500).json({err: errors});
	 }*/
	console.log("User : "+req.body.username);
	User.find({username: req.body.username}, function(err, user) {
	    if (err) {
	    	return res.status(500).json({message: err});
	    }
	    if(user != ""){
	    	return res.status(500).json({message: 'Email already registered!'});
	    }else{
	    	var user = new User({ 
	   		 username: req.body.username,
	   		 name: req.body.name,
	   		 company: req.body.company,
	   		 department: req.body.department,
	   		 phone: req.body.phone,
	   		 admin: false
	   		 });
	   	 console.log("user instance created :"+user);
	   	 async.waterfall([
	   	      function(done) {
	   	        crypto.randomBytes(16, function(err, buf) {
	   	          var token = buf.toString('hex');
	   	          done(err, token);
	   	        });
	   	      },
	   	      function(token, done) {
	   	          user.passwordRegisterToken = token;
	   	          user.passwordRegisterExpires = Date.now() + 3600000; // 1 hour
	   	          console.log("token generated : "+token);
	   	          
	   	          console.log("Preparing email process");		        
	   		        
	   		        var smtpTransport = nodemailer.createTransport("SMTP", {
	   		        	  service: "Gmail",
	   		        	  auth: {
	   		        	    XOAuth2: {
	   		        	      user: "ajitsangwan2006@gmail.com", // Your gmail address.
	   		        	                                            // Not @developer.gserviceaccount.com
	   		        	      clientId: "249105079815-2khvuvp0t2ut7kpj59rtthh3b9an3pod.apps.googleusercontent.com",
	   		        	      clientSecret: "Lz765CtEI44k1TcrCdivCmlO",
	   		        	      refreshToken: "1/Be_Z3-NVqH8mylDyNLiJomG8o669vCcYml2meEyP5_8MEudVrK5jSpoR30zcRFq6"
	   		        	    }
	   		        	  }
	   		        	});

	   		        	var mailOptions = {
	   		        	  from: "ajitsangwan2006@gmail.com",
	   		        	  to: user.username,
	   		        	  subject: "Welcome to Silver Leaf Solutions IT Asset Managment Portal",
	   		        	  generateTextFromHTML: true,
	   		        	  html: 'Dear Sir/Madam,<br/><br/><b>You are receiving this email because you (or someone else) have registered on Silver Leaf Solutions portal.\n\n' +
	   			            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	   			            'http://' + req.headers.host + '/#/register/' + token + '\n\n' +
	   			            'If you did not request this, please ignore this email.</b>\n'
	   		        	};

	   		        	smtpTransport.sendMail(mailOptions, function(error, response) {
	   		        	  if (error) {
	   		        	    console.log(error);
	   		        	  } else {
	   		        	    console.log(response);
	   		        	  }
	   		        	  smtpTransport.close();
	   		        	});
	   		        
	   		        
	   	          
	   	      }/*,
	   	      function(token, user, done) {
	   	    	  
	   	      }*/
	   	    ], function(err) {
	   	      if (err) {
	   	    	  res.status(500).json({err: "Error in sending email: "+err});
	   	      }
	   	    });
	   	 

	    	User.register(user, req.body.password, function(err, account) {
	    	    if (err) {
	    	      return res.status(500).json({err: "Error adding in DB :"+err});
	    	    }
	    	    passport.authenticate('local')(req, res, function () {
	    	    	res.status(200).json({status: 'Registration successfull! ' +'Validation link is sent to ' + user.username });
	    	    });
	    	  });
	    }
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
      if(user.passwordRegisterToken == '' || user.passwordRegisterToken == null || user.passwordRegisterToken == undefined){
		  console.log("User logged in with username : "+ user.username + " | Is Admin : "+user.admin);
		  req.session.user = user;
		  res.status(200).json({status: 'Login successful!', user: user});
	  }else{
		  res.status(500).json({err: "Please complete the validation process."}); 
		  
	  }
      
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
//	req.session.reset();
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