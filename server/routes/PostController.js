var express = require('express'),
    router = express.Router(),
    Post = require('../models/Post.js');
	Contact = require('../models/Contact.js');
	Career = require('../models/Career.js');
	Licence = require('../models/Licence.js');
    Reply = require('../models/Reply.js');
    multer  = require('multer');
    
    var path = require('path');
    var mime = require('mime');
    var fs = require('fs');
var fileName = "";
    
router.get('/Posts', function(req, res) {
	// object of all the users
	  Post.find({isDeleted:'N', postType:'blog'}, function(err, posts) {
		  if (err) throw err;
		  res.status(200).json(posts);
		});	  
});

router.get('/Events', function(req, res) {
	// object of all the users
	  Post.find({isDeleted:'N', postType:'event'}, function(err, posts) {
		  if (err) throw err;
		  res.status(200).json(posts);
		});	  
});

router.post('/fetchLicences', function(req, res) {
	// object of all the users
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	  }
	  
	if(req.query.isAdmin){
	  Licence.find({isDeleted:'N'}, function(err, licences) {
			  if (err) throw err;
			  res.status(200).json(licences);
		});	 
	}else{
		Licence.find({isDeleted:'N', assignedToUser: req.body.username}, function(err, licences) {
		  if (err) throw err;
		  res.status(200).json(licences);
		});	
	}
});


router.post('/download', function(req, res) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	  }
	var filename = path.basename(req.body.path);
  var mimetype = mime.lookup(req.body.path);
console.log("mime type = "+mimetype+" File name = "+filename);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(req.body.path);
  filestream.pipe(res);
	//res.download(req.body.path);
});
    
router.get('/getPostDetails', function(req, res) {
	// object of all the users
	console.log('inside getPostDetails '+req.query.postId);
	Post.findById(req.query.postId, function(err, post) {
		  if (err) throw err;
		  res.status(200).json(post);
		  console.log('inside getPostDetails');
		});
});
    
router.post('/PostData', function(req, res) {
	var post = new Post({
		  username: req.body.username,
		  postDetails: req.body.postDetails,
		  displayPost: req.body.postDetails.substring(0,15)+'.....',
		  isDeleted: 'N'
		});
	post.save(function(err) {
		  if (err) throw err;
		  Post.find({}, function(err, posts) {
			  if (err) throw err;
			  res.status(200).json(posts);
			});
		});
});
    
router.post('/DeletePost', function(req, res) {
	// get a user with ID of 1
	Post.findById(req.body.postID, function(err, post) {
	  if (err) throw err;

	  if(post.username == req.body.username){
		  post.isDeleted = 'Y';
		  post.save(function(err) {
		    if (err) throw err;
		    console.log('Post deleted successfully!');
		  });
		  Post.find({}, function(err, posts) {
			  if (err) throw err;
			  res.status(200).json(posts);
			});
	  }else{
		  return res.status(500).json({err: 'Authorization Failed!'});
	  }

	});
});
    
router.post('/Replies', function(req, res) {
	Reply.find({postID: req.body.postID}, function(err, replies) {
		  if (err) throw err;

		  res.status(200).json(replies);
		});
});
    
router.post('/PostReply', function(req, res) {
	var reply = new Reply({
			postID: req.body.postID,
			username: req.body.username,
			postDetails: req.body.replyDetails		  
		});
	reply.save(function(err) {
		  if (err) throw err;
		  console.log('Reply saved successfully!');
		  Reply.find({postID: req.body.postID}, function(err, replies) {
			  if (err) throw err;

			  res.status(200).json(replies);
			});
		});
});



var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './client/uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
router.post('/upload', function(req, res) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	  }
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        var post = new Post({
  		  username: req.body.username,
  		  postTitle: req.body.postTitle,
  		  postDetails: req.body.postDetails,
  		  displayPost: req.body.postDetails.substring(0,15)+'.....',
  		  imagePaths: req.file.path.substring(7),
  		  isDeleted: 'N',
  		  postDate: req.body.postDate,
  		  postTime: req.body.postTime,
  		  postType: req.body.postType
  		});
  	post.save(function(err) {
  		  if (err) throw err;
  		});
  	Post.find({isDeleted:'N'}, function(err, posts) {
		  if (err) throw err;
		  res.status(200).json(posts);
		});
         //res.json({error_code:0,err_desc:null});
    });
});

/** API path that will upload the files */
router.post('/uploadResume', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        var career = new Career({
      	  name: req.body.name,
      	  email: req.body.email,
      	  phone: req.body.phone,
      	  message: req.body.message,
      	  filePath: 'uploads'+req.file.path.substring(7),
      	  isDeleted: 'N'
      	});
          career.save(function(err) {
	      	  if (err) throw err;
	      	  res.status(200).json(career);
	      	});
    });
});

var storageLicense = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var uploadLicense = multer({ //multer settings
                storage: storageLicense
            }).fields([{ name: 'file', maxCount: 1 }, { name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]);
/*var uploadInvoice = multer({ //multer settings
		    storage: storageLicense
		}).single('file1');*/

/** API path that will upload the files */
router.post('/uploadLicence', uploadLicense, function(req, res) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	  }
	var licence = new Licence({
    	displayInfo: req.body.displayInfo,
    	uploadedBy: req.body.uploadedBy,
    	assignedToUser: req.body.assignedToUser,
    	assignedToName: req.body.assignedToName,
    	additionalInfo: req.body.additionalInfo,
    	filePath: 'uploads/'+req.files['file'][0].filename,
    	invoicePath: 'uploads/'+req.files['file1'][0].filename,
    	otherPath: 'uploads/'+req.files['file2'][0].filename,
    	isDeleted: 'N'
  	});
	/*uploadLicense(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        console.log("License File name : "+req.files['file'][0].filename);
        console.log("Invoice File name : "+req.files['file1'][0].filename);
    	//licence.filePath = 'uploads'+req.filename.substring(7);
    	
    });*/
	/*uploadInvoice(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }

    	//licence.invoicePath = 'uploads'+req.filename.substring(7);
    	console.log("invoice File name : "+uploadInvoice.filename);
        
    });*/
	console.log("licence : "+licence);
	
	licence.save(function(err) {
    	  if (err) throw err;	      	  
			
    	});
    
    Licence.find({isDeleted:'N'}, function(err, licences) {
		  if (err) throw err;
		  res.status(200).json({licences: licences});
	});
});

/** API path that will save contact */
router.post('/ContactSave', function(req, res) {
    var contact = new Contact({
	  name: req.body.name,
	  email: req.body.email,
	  phone: req.body.phone,
	  message: req.body.message,
	  isDeleted: 'N'
	});
    contact.save(function(err) {
	  if (err) throw err;
	res.status(200).json(contact);
	});
});



module.exports = router;