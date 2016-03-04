//var app = angular.module('schoolApp', []);

app.factory('schoolService', function() {
	 var schoolId = {}
	 function set(data) {
		 schoolId = data;
	 }
	 function get() {
	  return schoolId;
	 }

	 return {
	  set: set,
	  get: get
	 }

	});

app.factory('Posts', ['$http',function($http) {
	return {
		get : function() {
			return $http.get('/api/posts');
		},
		create : function(postData) {
			return $http.post('/api/posts', postData);
		},
		delete : function(id) {
			return $http.delete('/api/posts/' + id);
		}
	}
}]);
