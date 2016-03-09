(function () {
    'use strict';
    var app=angular
        .module('app');

app.controller('SetNewPasswordController', SetNewPasswordController);

    SetNewPasswordController.$inject = ['UserService', '$location', 'FlashService', '$rootScope', '$routeParams'];
    function SetNewPasswordController(UserService, $location, FlashService, $rootScope, $routeParams) {
        var vm = this;
        var id = $location.search().id;
        /*var _token = $routeParams.token;
        UserService.GetByToken(_token).then(function (response) {
            if (response.json.response.statuscode == 0) {
                var id_reset = response.json.response.candidateid;
            } else {
                FlashService.Error(response.json.response.statusmessage);
            }
        });*/

        vm.setnewpassword = setnewpassword;

        function setnewpassword() {
            var json ={ "json":{
                            "request":{
                                "servicetype":"21",
                                "functiontype":"1004",
                                "id": id,
                                "password":vm.password,
                                "retypepassword":vm.confirmpassword
                            }
                        }
                    }
            UserService.ResetPassword(json)
            .then(function (response) {
                console.log(response);
                if( response.success !== undefined ){
                    FlashService.Error(response.message,  true);
                } else {
                  if (response.json.response.statuscode == "0") {
                    $location.path('/login');
                  } else {
                      FlashService.Error(response.json.response.statusmessage);
                  }
                } 
            });
        }
    };
})();