(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.Login = Login;
        service.ResetPassword = ResetPassword;
        service.CheckMail = CheckMail;
        service.VerifyEmail = VerifyEmail;

        return service;

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function GetByToken(token) {
            return $http.get('/api/users/' + token).then(handleSuccess, handleError('Error getting user by token'));
        }

        function Create(user) {
            
            return $http.get('http://prod1.groupz.in:7070/JobzTop/Registration?request=' + JSON.stringify(user)).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }
        
        function VerifyEmail(id) {
            //console.log(id);
            return $http.get('http://prod1.groupz.in:7070/JobzTop/ValidateEmail?id=' + id).then(handleSuccess, handleError('Not success'));
        }
        

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function Login(user) {
            return $http.get('http://prod1.groupz.in:7070/JobzTop/Profile?request=' + JSON.stringify(user)).then(handleSuccess, handleError('Error Login'));
        }

        function CheckMail(email) {
            return $http.get('http://prod1.groupz.in:7070/JobzTop/Registration?request=' + JSON.stringify(email)).then(handleSuccess, handleError('Not correct email'));
        }
        // private functions

        function ResetPassword(user) {
            return $http.get('http://prod1.groupz.in:7070/JobzTop/Registration?request=' + JSON.stringify(user)).then(handleSuccess, handleError('Not success'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
