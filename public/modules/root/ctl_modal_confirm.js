angular.module('kita').controller('loadKitaModalDataCtrl', function ($rootScope, $filter, $scope, $http, $state, alertService, uploadFileService, $timeout, $window) {

    $scope.file = {};   

    $scope.SubmitProfilImg = function () {
        $scope.uploading = true;
        $scope.uploadSuccess = false;

        uploadFileService.upload($scope.file).then(function (data) {
            if (data.data.success) {
                $scope.uploading = false;
                $scope.alertUpload = 'alert alert-success';
                $scope.message = data.data.message;
                $http({
                    method: "PUT",
                    url: "/user/edit/profilImage",
                    data: {
                        "username": $rootScope.decodedToken.username,
                        "profilPathImg": "assets/img/profil_picture/" + data.data.file.filename
                    }
                }).then(function success(response){
                    $scope.uploadSuccess = true;
                    fileArray = {};
                    $scope.file = {};
                    $rootScope.decodedToken.profilPathImg = "assets/img/profil_picture/" + data.data.file.filename;
                    $window.sessionStorage.setItem("decodedToken", JSON.stringify($rootScope.decodedToken));
                }, function myError(response) {
                    alertService.showNotificationErrorEditProfilImg();
                });
             
            } else {
                $scope.uploading = false;
                $scope.alertUpload = 'alert alert-danger';
                $scope.message = data.data.message;
                fileArray = {};
                $scope.file = {};
            }
        })
    }


    $scope.editPwConfirm = function(){
        $http({
            method: "PUT",
            url: "/user/editPw",
            data: { "username": $rootScope.username, 
                    "oldPw": $rootScope.oldPw, 
                    "newPw": $rootScope.newPw }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'profil';
            $state.go('sync');
            alertService.showNotificationSuccesPwChange();
        }, function myError(response) {
            alertService.showNotificationErrorPwChange();
        });

        $scope.oldPw = null;
        $scope.newPw = null;
        $scope.newPw2 = null;
    }

    $scope.photoChanged = function (files) {
        if (files.length > 0 && files[0].name.match(/\.(jpeg|jpg|png)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                $timeout(function () {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                })
            }
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    }

    $scope.editUserConfirm = function () {
        $http({
            method: "PUT",
            url: "/user/edit",
            data: {
                "username": $rootScope.username,
                "first_name": $rootScope.first_name,
                "last_name": $rootScope.last_name,
                "address": $rootScope.address,
                "plz": $rootScope.plz,
                "ort": $rootScope.ort,
                "birth_date": $rootScope.birth_date,
                "telefon": $rootScope.telefon,
                "email": $rootScope.email,
                "groupid": $rootScope.groupid
            }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'editUser';
            $state.go('sync');
            alertService.showNotificationSuccesEditUser($rootScope.username);
        }, function myError(response) {
            alertService.showNotificationErrorEditUser();
        });
    }

    $scope.deleteUserConfirm = function () {
        $http({
            method: "GET",
            url: "/user/delete/" + $rootScope.username
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'editUser';
            $state.go('sync');
            alertService.showNotificationSuccesUserDelete($rootScope.username);
        }, function myError(response) {
            console.log(response);
            alertService.showNotificationErrorUserDelete();
        });
    }

    $scope.editProfilPicConfirm = function () {
        $scope.message = null;
        $scope.uploadSuccess = false;
        $rootScope.refreshedSite = 'profil';
        $state.go('sync');
        alertService.showNotificationSuccesEditProfilImg();
    }
    /*
    $scope.editEventConfirm = function(){
        
        $http({
            method: "PUT",
            url: "/calendar/editEvent",
            data: {
                "eventId": $rootScope.eventId,
                "title": $rootScope.eventName,
                "start": $rootScope.first_name,
                "color": $rootScope.last_name,
                "textColor": $rootScope.address,
            }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'editUser';
            $state.go('sync');
            alertService.showNotificationSuccesEditUser($rootScope.username);
        }, function myError(response) {
            alertService.showNotificationErrorEditUser();
        });

        
    }*/

    


    $scope.hasChanged = function(){ // This part is selected tag in modal ( here is modal view controller :) 
        $rootScope.groupSelect = $scope.$$childHead.selected;
    }

    $rootScope.changeOption = function(optValue){  // This is rootScope function, cooperated with calender controller :)
        //alert(optValue);haha what? :) 
        $scope.$$childHead.selected = optValue;
        $rootScope.groupSelect = optValue;
    }

    $scope.resetRootScope = function () {
        $rootScope.modalTitle = null;
        $rootScope.modalSuccesBtn = null;
        $rootScope.modalLink = null;
        $rootScope.modalBody = null;
        $rootScope.eventName = null;
        $rootScope.startTime = null;
        $rootScope.endTime = null;
        $rootScope.startDate = null;
        $rootScope.endDate = null;
        $rootScope.eventId = null;
        $rootScope.eventTitle = null;
        $scope.groupNames = $rootScope.groupNames;
    }

});