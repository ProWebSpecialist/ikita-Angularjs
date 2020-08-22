angular.module('kita').controller('startUserCtrl', function (AuthService, $rootScope, $scope, $http, alertService, $window, $state) {

    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
     } else {
         $state.go('login');
     }

     angular.element(document).ready(function () {
        alert('component loaded');
     });

});