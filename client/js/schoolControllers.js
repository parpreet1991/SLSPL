function MainController($scope, $http, schoolService)
{
	$scope.newSchoolForm = function () {
        schoolService.set('NEW');
     }
}

function UserController($scope, $http)
{
  $scope.person = {};
 
  $scope.createUser = function() 
  {
	$http({
      method: 'POST',
      url: 'http://localhost:9080/School/CreateUser.do?actionMode=ADD',
      headers: {'Content-Type': 'application/json'},
      data:  $scope.person
    }).success(function (data) 
      {
    	$scope.status=data;
      });
  };
}

function ListUsersCtrl($scope, $http)
{
	$scope.users = [{
		id: 1,
		name: 'Ajit Singh',
		details: 'Ajit rocks!',
		imageUrl: 'dist/img/user2-160x160.jpg',
		age:25
	},
	{
		id: 2,
		name: 'Amit Singh',
		details: 'Amit rocks!',
		imageUrl: 'dist/img/user2-160x160.jpg',
		age:23
	},
	{
		id: 3,
		name: 'Jagmit Singh',
		details: 'Jagmit rocks!',
		imageUrl: 'dist/img/user2-160x160.jpg',
		age:22
	},
	{
		id: 4,
		name: 'Rohit Kumar Gagan',
		details: 'Rohit rocks!',
		imageUrl: 'dist/img/user2-160x160.jpg',
		age:24
	}];
}

function chatCtrl($scope, $http){
	
}

function PostDataCtrl($scope, $http)
{
  //$scope.image = "";
	$scope.showModalWindow=false;
	$scope.modalPosts = [];
  $scope.posts = [
                        {
                            user: {
                                name: 'Sebastian',
                                familyName: 'Vettel'
                            },
                            date: '1/1/2016',
                            displayPost: "Run as docker container",
                            postDetails: "dockery is released as an nginx backed docker image to make it easier to use. The image is auto updated by every push with the latest tag, the versioning will be added after the first official releaseing"
                        },
                        {
                            user: {
                                name: 'Ajit',
                                familyName: 'Ajit'
                            },
                            date: '1/2/2016',
                            displayPost: "dockery",
                            postDetails: "Dockery is a lightweight docker management and monitoring application for developers. If you are new with container technologies and lxc based containerization, use Dockery for easier management and more productivity. Dockery is available as"
                        }
                      ];
  $scope.postData = function() 
  {
	  $scope.comment=true;
	  $scope.posts = $scope.posts.concat([{
		  user: {
              name: 'Ajit',
              familyName: 'Ajit'
          },
          date: '15/1/2016',
          displayPost: $scope.post.postDetails.substring(0,15)+'.....',
          postDetails: $scope.post.postDetails,
          image: $scope.modalPosts[0].image
	  }]);
	  $scope.showModalWindow=false;
	  $scope.modalPosts = [];
	  $scope.post.postDetails = "";
  };
  
  $scope.showModal=function()
  {
    //console.log($index)
	  $scope.showModalWindow=true;
  };
  
  $scope.hideModal = function()
  {
	  $scope.showModalWindow=false;
	  $scope.modalPosts = [];
	  $scope.post.postDetails = "";
  }
  
  
}



function PostDataFooterCtrl($scope, $http)
{  
  
  $scope.comment=false;
  $scope.innerComment = [];
  $scope.datas=[];
  $scope.InnerData=[];
  $scope.innercmt=false;
  $scope.postRepBtn=true;
	
	  
	
	  $scope.showInnerComment=function($index)
	  {
	    //console.log($index)
		  $scope.innerComment[$index]=true;
	  }
	
	  $scope.postReplied=function(txt1)
	  {
	    $scope.InnerData = $scope.InnerData.concat([{
			  user: {
	              name: 'Ajit',
	              familyName: 'Ajit'
	          },
	          date: '15/1/2016',
	          displayPost: txt1.substring(0,15)+'.....',
	          postDetails: txt1  
		  }]);
	    $scope.innercmt=true;
	    //$scope.postRepBtn=false;
	    $scope.txt1='';
	  }
  
  
}
