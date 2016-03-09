
(function () {
    'use strict';
    var app=angular
        .module('app');

app.directive("passwordVerify", function() {
  return {
    require: "ngModel",
    scope: {
      passwordVerify: '='
    },
    link: function(scope, element, attrs, ctrl) {
      scope.$watch(function() {
        var combined;

        if (scope.passwordVerify || ctrl.$viewValue) {
          combined = scope.passwordVerify + '_' + ctrl.$viewValue;
        }
        return combined;
      }, function(value) {
        if (value) {
          ctrl.$parsers.unshift(function(viewValue) {
            var origin = scope.passwordVerify;
            if (origin !== viewValue) {
              ctrl.$setValidity("passwordVerify", false);
              return undefined;
            } else {
              ctrl.$setValidity("passwordVerify", true);
              return viewValue;
            }
          });
        }
      });
    }
  };
});
    
 
    
    
app.controller('RegisterController', RegisterController);

   
    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            console.log($location);
            var baseUrl = $location.$$absUrl.split('#')[0];
            var json = { "json": {
                            "request": {
                              "servicetype":"21",
                              "functiontype":"1001",
                              "data": {
                                "email": vm.user.username,
                                "password": vm.user.password,
                                "retypepassword":vm.user.confirmPassword
                              },
                              "url":encodeURIComponent( baseUrl + "#VerifyEmail")
                            }
                          }
                        };
     
            UserService.Create(json)
            .then(function (response) {
                console.log(response);
                if( response.success !== undefined ){
                    FlashService.Error(response.message,  true);
                    vm.dataLoading = false;
                } else {
                  if (response.json.response.statuscode == "0") {
                    FlashService.Success('Registration successful', true);
                    $location.path('/afterregister');
                  } else {
                      FlashService.Error(response.json.response.statusmessage);
                      vm.dataLoading = false;
                  }
                }
            });
        }
    };

})();
