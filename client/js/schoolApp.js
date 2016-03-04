'use strict';

/* configurations */

var app = angular.module('schoolApp', ['ngRoute']);

// route configurations
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/ListPosts.html',
            controller: ''
        }).
        when('/ListPosts', {
            templateUrl: 'partials/ListPosts.html',
            controller: ''
        }).
        when('/ListUsers', {
            templateUrl: 'partials/ListUsers.html',
            controller: 'ListUsersCtrl'
        }).
        when('/chat/:id', {
            templateUrl: 'partials/chat.html',
            controller: 'ChatCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

app.filter('reverse', function() {
  return function(items) {
    if (!angular.isArray(items)) return false;
    return items.slice().reverse();
  };
});

app.directive('myUpload', [function () {
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