(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            var baseUrl = $location.$$absUrl.split('#')[0];
            AuthenticationService.Login(vm.username, vm.password, baseUrl, function (response) {
                if (response.json.response.statuscode == 0) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.json.response.statusmessage);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
