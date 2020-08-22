angular.module('iKita').controller('ctrlSync', function (AuthService,$rootScope, $state, $timeout, $http, $window) {

    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
     } else {
         $state.go('login');
     }

    $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {
        if ($rootScope.decodedToken.kitaname == null) {
            var kitaObj;
            $http({
                method: "GET",
                url: "kita/searchId/" + $rootScope.decodedToken.kitaid
            }).then(function mySuccess(response) {
                if (response.data == null) {
                    console.log(response.statusText);
                } else {
                    kitaObj = response.data.message;
                    $rootScope.decodedToken.kitaname = kitaObj.kitaname;
                    $window.sessionStorage.setItem("decodedToken", JSON.stringify($rootScope.decodedToken));
                    $rootScope.decodedToken = JSON.parse($window.sessionStorage.getItem("decodedToken"));
                    delete $window.sessionStorage.decodedToken;
                    $timeout(function () {
                        $state.go($rootScope.refreshedSite);
                        $rootScope.refreshedSite = null;
                    }, 1000);
                }

            }, function myError(error) {
                console.log(error.statusText);
            });
        }
        $timeout(function () {
            $state.go($rootScope.refreshedSite);
            $rootScope.refreshedSite = null;
        }, 1000);
    });
});