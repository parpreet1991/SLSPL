angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;
    var username = null;
    var admin = null;
    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      getUserName: getUserName,
      isAdmin: isAdmin
    });

    function isLoggedIn() {
        if(user) {
          return true;
        } else {
          return false;
        }
    }

    function getUserStatus() {
      return user;
    }

    function getUserName() {
      return username;
    }

    function isAdmin() {
    	if(admin) {
            return true;
          } else {
            return false;
          }
      return admin;
    }

    function login(username1, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login', {username: username1, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            username = username1;
            admin = data.user.admin;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          admin = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          admin = false;
          username = null;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          admin = false;
          username = null;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(registerForm) {

      // create a new instance of deferred
      var deferred = $q.defer();
      //alert(detail.age);
      // send a post request to the server
      $http.post('/user/register', {
    	  username: registerForm.username, 
    	  password: registerForm.password, 
    	  confirmPassword: registerForm.confirmPassword,
    	  name: registerForm.name,
    	  company: registerForm.company,
    	  phone: registerForm.phone,
    	  designation: registerForm.designation,
    	  department: registerForm.department
    	  })
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}]);