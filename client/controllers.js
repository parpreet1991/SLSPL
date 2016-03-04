angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log("UserName:::"+AuthService.getUserName());

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      console.log(AuthService.getUserStatus());

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log(AuthService.getUserStatus());

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password, $scope.registerForm.detail)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);




function ListUsersCtrl($scope, $http)
{
	
	// send a post request to the server
    $http.get('/user/userDetails', {})
      // handle success
      .success(function (data, status) {
        if(status == 200){
        	$scope.users = data;
        	deferred.resolve();
        }else{
        	deferred.reject();
        }
      })
      // handle error
      .error(function (data) {
        deferred.reject();
      });
}

function chatCtrl($scope, $http){
	
}

angular.module('myApp').controller('PostDataCtrl',
		  ['Upload','$window','$scope', '$http', 'AuthService',
		  function (Upload, $window, $scope, $http, AuthService) {
	$scope.showModalWindow=false;
	$scope.username = AuthService.getUserName();
	$scope.modalPosts = [];
	// send a post request to the server
	$http.get('/post/Posts', {})
	  // handle success
	      .success(function (data, status) {
	        if(status == 200){
	        	$scope.posts = data;
	        }
	      });
	    
	
	  var vm = this;
	    vm.submit = function(){ //function to call on form submit
	    if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
	        vm.upload(vm.file); //call upload function
	    }
	}
	
	vm.upload = function (file) {
	    Upload.upload({
	        url: '/post/upload', //webAPI exposed to upload the file
	        data:{file:file, fileName: file.name, postDetails: $scope.post.postDetails, username: AuthService.getUserName()} //pass file as data, should be user ng-model
	    }).then(function (resp) { //upload function returns a promise
	        if(resp.status === 200){ //validate success
	        	$scope.posts = resp.data;
	        	 $scope.showModalWindow=false;
		       	  $scope.modalPosts = [];
		       	  $scope.post.postDetails = "";
	            //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
	        } else {
	            $window.alert('an error occured');
	        }
	    }, function (resp) { //catch error
	        console.log('Error status: ' + resp.status);
	        $window.alert('Error status: ' + resp.status);
	    }, function (evt) { 
	        console.log(evt);
	        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
	        });
	    };
	    
	    
	  $scope.postData = function() 
	  {
		  $scope.comment=true;
		  $http.post('/post/PostData', {postDetails: $scope.post.postDetails, username: AuthService.getUserName()})
	  // handle success
	  .success(function (data, status) {
	    if(status == 200){
	    	$scope.posts = data;
	    	deferred.resolve();
	    }else{
	    	deferred.reject();
	    }
	  })
	  // handle error
	  .error(function (data) {
	    deferred.reject();
	  });
	  $scope.showModalWindow=false;
	  $scope.modalPosts = [];
	  $scope.post.postDetails = "";
	  };
	  
	  $scope.showModal=function()
	  {
		  $scope.showModalWindow=true;
	  };
	  
	  $scope.hideModal = function()
	  {
		  $scope.showModalWindow=false;
		  $scope.modalPosts = [];
		  $scope.post.postDetails = "";
	  }
  
 }]);



function PostDataFooterCtrl($scope, $http, AuthService)
{  
  
  $scope.comment=false;
  $scope.innerComment = [];
  $scope.datas=[];
  $scope.InnerData=[];
  $scope.innercmt=false;
  $scope.postRepBtn=true;
  $scope.selectedPost=null;
	
	  $scope.showInnerComment=function($index, post)
	  {
	    //console.log($index)
		  $scope.selectedPost = post;
		  if($scope.innerComment[$index])
			  $scope.innerComment[$index]=false;
		  else
			  $scope.innerComment[$index]=true;
		//send a post request to the server
		  $http.post('/post/Replies', {postID: $scope.selectedPost._id})
		    // handle success
		    .success(function (data, status) {
		      if(status === 200){
		      	$scope.InnerData = data;
		      }
		    });
	  }
	
	  $scope.postReplied=function(txt1)
	  {
		  
		// send a post request to the server
		    $http.post('/post/PostReply', {postID: $scope.selectedPost._id, username: AuthService.getUserName(), replyDetails: txt1})
		      // handle success
		      .success(function (data, status) {
		        if(status === 200){
		        	$scope.InnerData = data;
		        }
		      })
	    $scope.innercmt=true;
	    $scope.txt1='';
	  }
	
	  $scope.deletePost=function(txt1, post)
	  {		  
		// send a post request to the server
		    $http.post('/post/DeletePost', {postID: post._id, username: AuthService.getUserName()})
		      // handle success
		      .success(function (data, status) {
		        if(status === 200){
		        	$scope.InnerData = data;
		        }
		      })
	  }
  
  
}
