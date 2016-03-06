(function () {
    'use strict';
    var app=angular
        .module('app');

app.controller('ResetPasswordController', ResetPasswordController);

    ResetPasswordController.$inject = ['UserService', '$location', 'FlashService', '$rootScope'];
    function ResetPasswordController(UserService, $location, FlashService, $rootScope) {
        var vm = this;

        vm.checkMail = checkMail;
        vm.setnewpassword = setnewpassword;

        function checkMail() {
            UserService.GetByUsername(vm.email).then(function (response) {
                if (response.json.response.statuscode == 0) {
                    var _token = response.json.response.auth_token;
                } else {
                    FlashService.Error(response.json.response.statusmessage);
                }
            });

            var json = {"json":
                          {"request":
                            {
                              "servicetype":"21",
                              "functiontype":"1003",
                              "email": vm.email,
                              "url":"http://prod1.groupz.in:7070/JobzTop/setnewpassword/" + id
                            }
                          }
                        }
            UserService.CheckMail(json)
                .then(function (response) {
                    if (response.json.response.statuscode == 0) {
                        FlashService.Success('Email sent!', true);
                        $location.path('/resetpasswordmailsent');
                    } else {
                        FlashService.Error(response.json.response.statusmessage);
                    }
                });
        }

    };

})();