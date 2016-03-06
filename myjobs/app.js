(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
    function config($routeProvider, $locationProvider, $httpProvider ) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'view/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'view/login.view.html',
                controllerAs: 'vm'
            })
        
           
            .when('/resetpassword', {
                controller: 'ResetPasswordController',
                templateUrl: 'view/resetpassword.view.html',
                controllerAs: 'vm'
            
            })
            
            .when('/resetpasswordmailsent',{
                templateUrl: 'view/resetpasswordmailsent.view.html'
            })

            .when('/setnewpassword/:token', {
                controller: 'SetNewPasswordController',
                templateUrl: 'view/setnewpassword.view.html',
                controllerAs: 'vm'    
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'view/register.view.html',
                controllerAs: 'vm'
            })

            .when('/afterregister', {
                templateUrl: 'view/activationlinksent.view.html'
            })

            .when('/VerifyEmail', {
                controller: 'EmailActivationController',
                templateUrl: 'view/accountactivation.view.html',
                controllerAs :'vm'
            })

            .otherwise({ redirectTo: '/login' });

            $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/resetpassword','/register','/resetpasswordmailsent','/afterregister','/setnewpassword','/VerifyEmail']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
})();