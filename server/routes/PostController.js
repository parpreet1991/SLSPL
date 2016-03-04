var express = require('express'),
    router = express.Router(),
    Post = require('../models/Post.js');
    Reply = require('../models/Reply.js');
    multer  = require('multer');
var fileName = "";
    
router.get('/Posts', function(req, res) {
	// object of all the users
	  Post.find({isDeleted:'N'}, function(err, posts) {
		  if (err) throw err;
		  res.status(200).json(posts);
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
        cb(null, './uploads/');
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
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        var post = new Post({
  		  username: req.body.username,
  		  postDetails: req.body.postDetails,
  		  displayPost: req.body.postDetails.substring(0,15)+'.....',
  		  imagePaths: req.file.path,
  		  isDeleted: 'N'
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

module.exports = router;