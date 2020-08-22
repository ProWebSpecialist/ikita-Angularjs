angular.module('kita').controller('loadKitaDataCtrl', function (AuthService, $rootScope, $filter, $scope, $http, $state, alertService, $window) {

    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
     } else {
         $state.go('login');
     }

    

    $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {

        $scope.username = null;
        $scope.first_name = null;
        $scope.last_name = null;
        $scope.street = null;
        $scope.house_nr = null;
        $scope.plz = null;
        $scope.ort = null;
        $scope.birth_date = null;
        $scope.telefon = null;
        $scope.email = null;
        $scope.groupid = null;

        var kitaObj;

        $http({
            method: "GET",
            url: "kita/searchId/" + $rootScope.decodedToken.kitaid
        }).then(function mySuccess(response) {
            if (response.data == null) {
                console.log(response.statusText);
            } else {

                kitaObj = response.data.message;

                $scope.kitaid = kitaObj._id;

                $scope.kitaname = kitaObj.kitaname;

                $scope.kitaDescription = kitaObj.description;

                $scope.kitaTelefon = kitaObj.telefon;

                $scope.kitaEmail = kitaObj.email;

                $scope.kitaOrt = kitaObj.ort;

                $scope.kitaKanton = kitaObj.kanton;

                $scope.kitaPlz = kitaObj.plz;

                $scope.kitaAddress = kitaObj.address;

            }

        }, function myError(error) {
            console.log(error.statusText);
        });

        var i;
        $scope.Groups = [];
        $http({
            method: "GET",
            url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid
        }).then(function mySuccess(response) {
            for (i = 0; i < response.data.length; i++) {
                $scope.Groups.push({ _id: response.data[i]._id, groupname: response.data[i].groupname });
            }
        }, function myError(error) {
            console.log(error.statusText);
        });
    });

    $scope.usernameChecker = function () {
        $http({
            method: "GET",
            url: "user/register/" + $scope.username
        }).then(function mySuccess(response) {
            if (response.data == null) {
                $rootScope.isUsername = false;
            } else {
                $rootScope.isUsername = true;
            }
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    $scope.register = function () {

        var standardPw = "ikita2018";
        var address = $scope.street + "_" + $scope.house_nr;
        var usertype = 0;
        var groupid = $scope.groupSelected._id;

        $http({
            method: "POST",
            url: "/user/register",
            data: {
                "username": $scope.username,
                "password": standardPw,
                "first_name": $scope.first_name,
                "last_name": $scope.last_name,
                "address": address,
                "plz": $scope.plz,
                "ort": $scope.ort,
                "birth_date": $scope.birth_date,
                "telefon": $scope.telefon,
                "email": $scope.email,
                "usertype": usertype,
                "kitaid": $scope.kitaid,
                "groupid": groupid
            }
        }).then(function mySuccess(response) {
            $state.go('kita');
            alertService.showNotificationSuccesRegister($scope.username);
        }, function myError(response) {
            alertService.showNotificationErrorRegister();
        });
    }

    $scope.editUser = function () {
        $rootScope.username = $scope.username;
        $rootScope.first_name = $scope.first_name;
        $rootScope.last_name = $scope.last_name;
        $rootScope.address = $scope.street + "_" + $scope.house_nr;
        $rootScope.plz = $scope.plz;
        $rootScope.ort = $scope.ort;
        $rootScope.birth_date = $scope.birth_date;
        $rootScope.telefon = $scope.telefon;
        $rootScope.email = $scope.email;
        $rootScope.groupid = $scope.groupSelected._id;
     
        $rootScope.modalTitle = "Benutzerdaten editieren";
        $rootScope.modalSuccesBtn = "Editieren bestätigen"
        $rootScope.modalLink = "editUser";
        $rootScope.modalBody = "Sind Sie sicher, dass Sie die Benutezrdaten von " + $scope.username + " editieren wollen?"
        $('#Modal').modal('show');

    }

    

    $scope.deleteUser = function () {

        $rootScope.username = $scope.username;

        $rootScope.modalTitle = "Benutzer löschen";
        $rootScope.modalSuccesBtn = "Löschen bestätigen"
        $rootScope.modalLink = "deleteUser";
        $rootScope.modalBody = "Sind Sie sicher, dass Sie den User " + $scope.username + " löschen wollen?"
        $('#Modal').modal('show');

    }

    

    $scope.loadUsers = function (groupid) {
        var i;
        $scope.Users = [];
        $http({
            method: "GET",
            url: "user/getUsersByGroup/" + groupid
        }).then(function mySuccess(response) {
            for (i = 0; i < response.data.length; i++) {
                $scope.Users.push({ _id: response.data[i]._id, username: response.data[i].username });
            }
        }, function myError(error) {
            console.log(error.statusText);
        });
    }

    $scope.loadUserData = function (userid) {
        var userObj;

        $http({
            method: "GET",
            url: "user/getUserDataById/" + userid
        }).then(function mySuccess(response) {
            if (response.data == null) {
                console.log(response.statusText);
            } else {
                userObj = response.data;

                var array = userObj.address.split("_");

                var street = array[0];
                var house_nr = array[1];

                $scope.username = userObj.username;

                $scope.first_name = userObj.first_name;

                $scope.last_name = userObj.last_name;

                $scope.street = street;

                $scope.house_nr = house_nr;

                $scope.birth_date = new Date(userObj.birth_date);

                $scope.plz = userObj.plz;

                $scope.ort = userObj.ort;

                $scope.email = userObj.email;

                $scope.telefon = userObj.telefon;

                $scope.groupSelected._id = userObj.groupid;

            }

        }, function myError(error) {
            console.log(error.statusText);
        });
    }
});