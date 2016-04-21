angular.module('myApp').controller('loginController',
  ['$scope', '$rootScope', '$location', 'AuthService',
  function ($scope, $rootScope, $location, AuthService) {
	  $rootScope.currentPage = "none";
    console.log("UserName:::"+AuthService.getUserName());

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
	    	if(AuthService.isAdmin()){
	    		$location.path('/admin');
	    	}else{
	    		$location.path('/');
	    	}
          $scope.disabled = false;
          $scope.loginForm = {};
          $rootScope.AuthService = AuthService;
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
  ['$scope', '$rootScope', '$location', 'AuthService',
  function ($scope, $rootScope, $location, AuthService) {
	  $rootScope.currentPage = "none";
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
  ['$scope', '$rootScope', '$location', 'AuthService',
  function ($scope, $rootScope, $location, AuthService) {
	  $rootScope.currentPage = "none";
    console.log(AuthService.getUserStatus());

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.success = false;
      $scope.disabled = true;

      if($scope.registerForm.password != $scope.registerForm.confirmPassword){
    	  $scope.error = true;
          $scope.errorMessage = "Missmatch Password & Confirm Password";
          $scope.disabled = false;
      }else{
		  // call register from service
		  AuthService.register($scope.registerForm)
		    // handle success
		    .then(function () {
		      //$location.path('/login');
		    	$scope.success = true;
		        $scope.successMessage = "Registration successful! Validation link is sent to email";
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
      }

    };

}]);



angular.module('myApp').controller('registerValidationController',
		  ['$scope', '$routeParams', '$rootScope', '$http',
		  function ($scope, $routeParams, $rootScope, $http) {
			  $rootScope.currentPage = "none";
			  var token = $routeParams.token;
			  $http({
				  method: 'GET',
				  url: '/user/register?token=' + token
				}).then(function successCallback(response) {
						if(response.status == 200){
							$scope.successMessage = response.data.message;
							$scope.success = true;
						}else{
							$scope.errorMessage = response.data.message;
							$scope.error = true;
						}
				  }, function errorCallback(response) {
					  $scope.errorMessage = response.data.message;
						$scope.error = true;
				  });
			  
		}]);



angular.module('myApp').controller('forgotPasswordController',
		  ['$scope', '$routeParams', '$rootScope', '$http',
		  function ($scope, $routeParams, $rootScope, $http) {
			  $rootScope.currentPage = "none";
			  $scope.submit = function(){
				  $http({
					  method: 'GET',
					  url: '/user/forgotPassword?username=' + $scope.username
					}).then(function successCallback(response) {
							if(response.status == 200){
								$scope.successMessage = response.data.message;
								$scope.success = true;
							}else{
								$scope.errorMessage = response.data.message;
								$scope.error = true;
							}
					  }, function errorCallback(response) {
						  $scope.errorMessage = response.data.message;
							$scope.error = true;
					  });
			  }
			  
		}]);


angular.module('myApp').controller('validateForgotPasswordController',
		  ['$scope', '$routeParams', '$rootScope', '$http',
		  function ($scope, $routeParams, $rootScope, $http) {
			  $rootScope.currentPage = "none";
			  $scope.submit = function(){
				  $http.post('/user/validateForgotPassword', {
					  username: $scope.username, 
					  password: $scope.password, 
					  confirmPassword: $scope.confirmPassword, 
					  token: $routeParams.token
					  
					  })
				    // handle success
				    .success(function (data, status) {
				    	if(status == 200){ 
					       	  $scope.success = true;
					       	  $scope.successMessage = "Password reset is success, you can login now.";
				        } else {
				        	$scope.error = true;
					       	$scope.errorMessage = "Some problem occurred.";
				        }
				    });
			  }
			  
		}]);

angular.module('myApp').controller('mainController',
		  ['$scope', '$rootScope','$location', 'AuthService',
		  function ($scope, $rootScope, $location, AuthService) {
			  $rootScope.currentPage = "show";
		}]);

angular.module('myApp').controller('aboutController',
		  ['$scope', '$rootScope','$location', 'AuthService',
		  function ($scope, $rootScope, $location, AuthService) {
			  $rootScope.currentPage = "none";
		}]);


angular.module('myApp').controller('contactController',
		  ['$scope', '$rootScope','$location', 'AuthService',
		  function ($scope, $rootScope, $location, AuthService) {
			  $rootScope.currentPage = "none";
		}]);

angular.module('myApp').controller('servicesController',
		  ['$scope', '$rootScope','$location', 'AuthService',
		  function ($scope, $rootScope, $location, AuthService) {
			  $rootScope.currentPage = "none";
		}]);

angular.module('myApp').controller('blogsController',
		  ['$scope', '$rootScope','$location', 'AuthService',
		  function ($scope, $rootScope, $location, AuthService) {
			  $rootScope.currentPage = "none";
		}]);

angular.module('myApp').controller('blogPostController',
		  ['$scope', '$routeParams', '$rootScope','$location', 'AuthService', '$http',
		  function ($scope, $routeParams, $rootScope, $location, AuthService,  $http) {
			  $rootScope.currentPage = "none";
			  $http.get('/post/getPostDetails?postId=' + $routeParams._id).success(function(data) {
			      $scope.post = data;
			      document.getElementById("demo").innerHTML = $scope.post.postDetails;
			    });
		}]);

angular.module('myApp').controller('adminController',
		  ['$scope', '$rootScope','$location', 'AuthService',
		  function ($scope, $rootScope, $location, AuthService) {			  
			  $rootScope.currentPage = "none";			  
			  $scope.mytime = new Date();
			  $scope.hstep = 1;
			  $scope.mstep = 15;
			  
			  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			  $scope.format = $scope.formats[0];
			  $scope.altInputFormats = ['M!/d!/yyyy'];

			  $scope.popup1 = {
			    opened: false
			  };
			  
			  $scope.open1 = function() {
				    $scope.popup1.opened = true;
				  };
				  
				  


			  $scope.dateOptions = {
			    dateDisabled: disabled,
			    formatYear: 'yy',
			    maxDate: new Date(2020, 5, 22),
			    minDate: new Date(),
			    startingDay: 1
			  };

			  // Disable weekend selection
			  function disabled(data) {
			    var date = data.date,
			      mode = data.mode;
			    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
			  }
			  
			  $scope.status = {
					    isopen: false
					  };

					  $scope.toggled = function(open) {
					    $log.log('Dropdown is now: ', open);
					  };

					  $scope.toggleDropdown = function($event) {
					    $event.preventDefault();
					    $event.stopPropagation();
					    $scope.status.isopen = !$scope.status.isopen;
					  };

					  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
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



angular.module('myApp').controller('ShowBlogCtrl',
		  ['$scope', '$http', 'AuthService',
		  function ($scope, $http, AuthService) {
	// send a post request to the server
	$http.get('/post/Posts', {})
	  // handle success
	      .success(function (data, status) {
	        if(status == 200){
	        	$scope.posts = data;
	        }
	      });
  
 }]);

angular.module('myApp').controller('PostDataCtrl',
		  ['Upload','$window','$scope', '$rootScope', '$http', 'AuthService',
		  function (Upload, $window, $scope, $rootScope, $http, AuthService) {
			  $rootScope.currentPage = "none";
	//$scope.showModalWindow=false;
	$scope.username = AuthService.getUserName();
	//$scope.modalPosts = [];
	// send a post request to the server
	$http.get('/post/Posts', {})
	  // handle success
	      .success(function (data, status) {
	        if(status == 200){
	        	$scope.posts = data;
	        }
	      });
	    
	
	  var vm = this;
	    vm.submit = function(postType){ //function to call on form submit
	    if (vm.upload_form.file.$valid && vm.file) { //check if form is valid
	        vm.upload(vm.file, postType); //call upload function
	    }
	}
	
	vm.upload = function (file, postType) {
	    Upload.upload({
	        url: '/post/upload', //webAPI exposed to upload the file
	        data:{file:file, fileName: file.name, postTitle: $scope.post.postTitle, postDetails: $scope.post.postDetails, username: AuthService.getUserName(), postDate: $scope.post.postDate, postTime: $scope.post.postTime, postType: postType} //pass file as data, should be user ng-model
	    }).then(function (resp) { //upload function returns a promise
	        if(resp.status === 200){ //validate success
	        	$scope.posts = resp.data;
	        	 $scope.showModalWindow=false;
		       	  $scope.modalPosts = [];
		       	  $scope.post.postDetails = "";
		       	  $scope.post.postTitle = "";
		       	  $scope.file = "";
		       	  $scope.success = true;
		       	  $scope.successMessage = "Blog saved successfuly.";
	            //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
	        } else {
	        	$scope.error = true;
		       	$scope.errorMessage = "Some problem occurred.";
	        }
	    }, function (resp) { //catch error
	        console.log('Error status: ' + resp.status);
	        $scope.error = true;
	       	$scope.errorMessage = "Some problem occurred.";
	    }, function (evt) { 
	        console.log(evt);
	        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
	        });
	    };
	    
	    
	  /*$scope.postData = function() 
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
	  }*/
  
 }]);

angular.module('myApp').controller('EventDataCtrl',
		  ['$window', '$scope', '$rootScope', '$http', 'AuthService',
		  function ($window, $scope, $rootScope, $http, AuthService) {
			  $rootScope.currentPage = "none";
	 // send a post request to the server
		$http.get('/post/Events', {})
		  // handle success
	      .success(function (data, status) {
	        if(status == 200){
	        	$scope.posts = data;
	        }
	      });

}]);

angular.module('myApp').controller('ContactCtrl',
		  ['$window', '$scope', '$rootScope', '$http', 'AuthService',
		  function ($window, $scope, $rootScope, $http, AuthService) {
			  $rootScope.currentPage = "none";
	
	  $scope.saveContact = function(){
		  // send a post request to the server
		$http.post('/post/ContactSave', {name: $scope.contact.name, phone: $scope.contact.phone, email: $scope.contact.email, message: $scope.contact.message})
	    // handle success
	    .success(function (data, status) {
	    	if(status == 200){ 
		       	  $scope.success = true;
		       	  $scope.successMessage = "Message Sent.";
		       	  document.getElementById('contactForm').reset();
	        } else {
	        	$scope.error = true;
		       	$scope.errorMessage = "Some problem occurred.";
	        }
	    });
	  }

}]);

angular.module('myApp').controller('CareerCtrl',
		  ['Upload','$window', '$scope', '$rootScope', '$http', 'AuthService',
		  function (Upload, $window, $scope, $rootScope, $http, AuthService) {
			  $rootScope.currentPage = "none";
	
			  var vm = this;
			    vm.submit = function(){ //function to call on form submit
			    if (vm.upload_form.file.$valid && vm.file) { //check if form is valid
			        vm.upload(vm.file); //call upload function
			    }
			}
			
			vm.upload = function (file) {
			    Upload.upload({
			        url: '/post/uploadResume', //webAPI exposed to upload the file
			        data:{file:file, fileName: file.name, name: $scope.career.name, email: $scope.career.email, phone: $scope.career.phone, message: $scope.career.message} //pass file as data, should be user ng-model
			    }).then(function (resp) { //upload function returns a promise
			        if(resp.status === 200){ //validate success
				       	  $scope.career.name = "";
				       	  $scope.career.email = "";
				       	  $scope.career.phone = "";
				       	  $scope.career.message = "";
				       	  $scope.file = "";
				       	  $scope.success = true;
				       	  $scope.successMessage = "Profile uploaded successfuly.";
			            //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
			        } else {
			        	$scope.error = true;
				       	$scope.errorMessage = "Some problem occurred.";
			        }
			    }, function (resp) { //catch error
			        console.log('Error status: ' + resp.status);
			        $scope.error = true;
			       	$scope.errorMessage = "Some problem occurred.";
			    }, function (evt) { 
			        console.log(evt);
			        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
			        vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
			        });
			    };

}]);

angular.module('myApp').controller('LicenceCtrl',
		  ['Upload','$window', '$scope', '$rootScope', '$http', 'AuthService',
		  function (Upload, $window, $scope, $rootScope, $http, AuthService) {
			  $rootScope.currentPage = "none";
			  
			  $http.post('/post/fetchLicences', {username: AuthService.getUserName(), isAdmin: AuthService.isAdmin()})
			// handle success
			.success(function (data, status) {
				if(status == 200){ 
			       	  $scope.success = true;
			       	  $scope.licences = data;
			    } else {
			    	$scope.error = true;
			       	$scope.errorMessage = "Some problem occurred.";
			        }
			    });
			
			  var vm = this;
			    vm.submit = function(){ //function to call on form submit
			if (vm.upload_form.file.$valid && vm.file && vm.upload_form.file1.$valid && vm.file1 && vm.upload_form.file2.$valid && vm.file2) { //check if form is valid
			    vm.upload(vm.file, vm.file1, vm.file2); //call upload function
			    }
			}
			
			vm.upload = function (file, file1, file2) {
			    Upload.upload({
			        url: '/post/uploadLicence', //webAPI exposed to upload the file
			        data:{file:file, fileName: file.name, file1:file1, fileName1: file.name1, file2:file2, fileName2: file.name2, displayInfo: $scope.licence.displayInfo, uploadedBy: AuthService.getUserName(), assignedToUser: $scope.licence.assignedToUser, assignedToName: $scope.licence.assignedToName, additionalInfo: $scope.licence.additionalInfo} //pass file as data, should be user ng-model
			    }).then(function (resp) { //upload function returns a promise
			        if(resp.status === 200){ //validate success
				       	  $scope.success = true;
				       	  $scope.successMessage = "Profile uploaded successfuly.";
				       	  $scope.licences = resp.data.licences;
				       	  
			            //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
			        } else {
			        	$scope.error = true;
				       	$scope.errorMessage = "Some problem occurred.";
			        }
			    }, function (resp) { //catch error
			        console.log('Error status: ' + resp.status);
			        $scope.error = true;
			       	$scope.errorMessage = "Some problem occurred.";
			    }, function (evt) { 
			        console.log(evt);
			        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
			        vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
			        });
			    };
			    
	$scope.download = function($path){
		$http.post('/post/download', {path: $path},{responseType: 'arraybuffer'} ).
		  success(function(data, status, headers, config) {
		    //$window.open('/download'); //does the download
			  
			  var file = new Blob([ data ], {
                  type : 'application/pdf'
              });
              //trick to download store a file having its URL
              var fileURL = URL.createObjectURL(file);
              var a         = document.createElement('a');
              a.href        = fileURL; 
              a.target      = '_blank';
              a.download    = 'file.pdf';
              document.body.appendChild(a);
              a.click();
			  
		  }).
		  error(function(data, status, headers, config) {
		    console.log('ERROR: could not download file');
		  });
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
