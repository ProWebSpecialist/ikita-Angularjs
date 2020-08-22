angular.module('kita').controller('feedbackCtrl', function (AuthService, $rootScope, $filter, $scope, $http, $state, alertService, $window) {
    
    var childs = [];
    var groups = [];

    var receive_userid, receive_username;
    
    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
     } else {
         $state.go('login');
     }

     angular.element(document).ready(function () {

        $http({
            method: "GET",
            url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid,
        }).then(function mySuccess(res) {
            res.data.forEach(element => {
                groups.push({
                    id: element._id, 
                    name: element.groupname
                });
            });
            $scope.groups = groups;
        });

        $http({
            method: "POST",
            url: "user/getAllUsersData/",
            data : {
                kitaID : $rootScope.decodedToken.kitaid
            }
        }).then(function mySuccess(response) {
            response.data.forEach(element => {
                childs.push({
                    value : element._id,
                    text : element.first_name + " " + element.last_name,
                    group : element.groupid
                });
            });
            $scope.childs = childs;
        });

     });

     $scope.hasChanged = function(){
         //alert($scope.selected);
         // $scope.selected -> student id
         $http({
            method: "GET",
            url: "user/getUserDataById/" + $scope.selected
        }).then(function mySuccess(response) {
            receive_userid = response.data._id;
            receive_username = response.data.username;
        });

     }

     $scope.feedbackSend = function(){

        if (receive_username && $scope.fbtitle && $scope.fbcontent ){

            var currentdate = new Date(); 

            $http({
                method: "POST",
                url: "feedback/createFeedback/",
                data : {
                    fromId : $rootScope.decodedToken.userid,
                    fromName : $rootScope.decodedToken.username,
                    fromImg : $rootScope.decodedToken.profilPathImg,
                    toId : receive_userid,
                    toName : receive_username,
                    fbTitle : $scope.fbtitle,
                    fbContent : $scope.fbcontent,
                    fbDate : currentdate
                }
            }).then(function mySuccess(response) {
                alertService.showNotificationSuccesSendFeedback();
                $window.history.back();
            });

        }else{

            alertService.showNotificationFailedSendFeedback();
        }

        
     }

});