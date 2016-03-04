var myApp = angular.module('myApp', ['ngRoute', 'ngFileUpload']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
    	templateUrl: 'partials/main.html',
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
    .when('/one', {
      template: '<h1>This is page one!</h1>',
      access: {restricted: true}
    })
    .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: false}
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
