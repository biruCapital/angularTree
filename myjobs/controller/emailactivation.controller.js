
(function () {
    'use strict';
    var app=angular
        .module('app');


app.controller('EmailActivationController', EmailActivationController);

   
    EmailActivationController.$inject = ['UserService', '$location', '$rootScope', 'FlashService', '$routeParams'];
    function EmailActivationController(UserService, $location, $rootScope, FlashService, routeParams ) {
        var vm = this;

        vm.VerifyEmail = VerifyEmail;
        
        function VerifyEmail() {
            vm.dataLoading = true;
            var id = $location.search().id;        
            UserService.VerifyEmail(id)
            .then(function (response) {
                //console.log($location);
                if( response.success !== undefined ){
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                } else {
                    if (response.json.response.statuscode == "0") {
                      FlashService.Success('Email Verification is Successful', true);
                      $location.path('/VerifyEmail');
                    } else {
                        FlashService.Error(response.json.response.statusmessage);
                        vm.dataLoading = false;
                    }
                }
            });
        }
    };

})();
