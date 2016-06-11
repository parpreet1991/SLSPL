var myApp = angular.module('myApp', ['ngRoute', 'ngFileUpload', 'ui.bootstrap', 'textAngular']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
    	templateUrl: 'partials/main.html',
    	controller: 'mainController',
        access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/register/:token', {
        templateUrl: 'partials/registerValidation.html',
        controller: 'registerValidationController',
        access: {restricted: false}
    })
    .when('/forgotPassword', {
        templateUrl: 'partials/forgotPassword.html',
        controller: 'forgotPasswordController',
        access: {restricted: false}
	  })
	  .when('/validateForgotPassword/:token', {
		  templateUrl: 'partials/forgotPassword.html',
		  controller: 'validateForgotPasswordController',
	      access: {restricted: false}
	  })
    .when('/main', {
    	templateUrl: 'partials/main.html',
    	controller: 'mainController',
        access: {restricted: false}
    })
    .when('/about', {
    	templateUrl: 'partials/about.html',
    	controller: 'aboutController',
        access: {restricted: false}
    })
    .when('/services', {
    	templateUrl: 'partials/services.html',
      controller: 'servicesController'
    })
    .when('/partners', {
    	templateUrl: 'partials/partners.html',
      controller: 'servicesController',
      access: {restricted: false}
    })
    .when('/blogs', {
    	templateUrl: 'partials/blogs.html',
      controller: 'blogsController',
      access: {restricted: false}
    })
    .when('/blog-post/:_id', {
    	templateUrl: 'partials/blog-post.html',
      controller: 'blogPostController',
      access: {restricted: false}
    })
    .when('/event/:_id', {
    	templateUrl: 'partials/event.html',
      controller: 'blogPostController',
      access: {restricted: false}
    })
    .when('/events', {
    	templateUrl: 'partials/events.html',
      controller: 'EventDataCtrl',
      access: {restricted: false}
    })
    .when('/contact', {
    	templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl',
        access: {restricted: false}
      })
      .when('/career', {
      	templateUrl: 'partials/career.html',
          controller: 'CareerCtrl',
          access: {restricted: false}
        })
      .when('/admin', {
    	  templateUrl: 'partials/admin-controls.html',
    	  controller: 'adminController',
          access: {restricted: true}
        })
        .when('/licences', {
      	  templateUrl: 'partials/licences.html',
      	  controller: 'LicenceCtrl',
            access: {restricted: true}
          })
     .when('/uploads/:filename',{
    	 templateUrl: '404.html',
    	 controller: ''
     })
    .when('/ListPosts', {
        templateUrl: 'partials/ListPosts.html',
        controller: '',
        access: {restricted: true}
    })
    .when('/ListUsers', {
        templateUrl: 'partials/ListUsers.html',
        controller: 'ListUsersCtrl',
        access: {restricted: true}
    })
    .when('/chat/:id', {
        templateUrl: 'partials/chat.html',
        controller: 'ChatCtrl',
        access: {restricted: true}
    })
    .otherwise({redirectTo: '/'});
});


myApp.run(function ($rootScope, $location, $route, AuthService) {
	//$rootScope.currentPage = "main";
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.access.restricted && AuthService.isLoggedIn() === false) {
      $location.path('/login');
    }    
  });
});

myApp.filter('reverse', function() {
  return function(items) {
    if (!angular.isArray(items)) return false;
    return items.slice().reverse();
  };
});

myApp.directive('myUpload', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var reader = new FileReader();
            reader.onload = function (e) {
                //scope.post.image = e.target.result;
                scope.modalPosts = scope.modalPosts.concat([{
          		  user: {
                        name: 'Ajit',
                        familyName: 'Ajit'
                    },
                    date: '15/1/2016',
                    image: e.target.result  
          	  }]);
                scope.$apply();
            }

            elem.on('change', function() {
                reader.readAsDataURL(elem[0].files[0]);
            });
        }
    };
}]);
