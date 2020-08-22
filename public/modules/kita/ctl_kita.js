angular.module('kita').controller('kitaCtrl', function (AuthService, $rootScope, $scope, $http, alertService, $window, $state) {

    var kitas = [
        {
            value : -999,
            name : ""
        }
    ];

    var kids = [];

    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
     } else {
         $state.go('login');
     }

    angular.element(document).ready(function () {
        // Get User's kita id  /:groupid
        // Get groupname from db using kita id

        //console.log($rootScope.decodedToken.userid + "  " + $rootScope.decodedToken.username + "   " + $rootScope.decodedToken.kitaid);
        
        $http({
            method: "GET",
            url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid,
        }).then(function mySuccess(res) {
            res.data.forEach(element => {
                //element.groupname
                kitas.push({value: element._id, name: element.groupname});
            });
        });
        $scope.selected =  kitas[0];    // show default value here for options
        $scope.kitas = kitas;           // pass the data into scope
        
     });

    $scope.hasChanged = function(){
        //alert($scope.selected.name + "   " + $scope.selected.value);

        if ($scope.selected.value >= 0){
            //Here we would like to show kid's info

            kids = [];

            $http({
                method: "GET",
                url: "user/getUsersByGroup/" + $scope.selected.value,
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    kids.push({'uImage' : element.profilPathImg, 
                                'fullname' : element.first_name + " " + element.last_name,
                                'username' : element.username                            
                            });
                });

                $scope.kids = kids;
                $scope.count_kids = kids.length;
            });
        }else{
            $scope.kids = [];
            $scope.count_kids = 999;
        }
     }

    $scope.edit = function () {
        $http({
            method: "PUT",
            url: "/kita/editKita",
            data: {
                "_id": $scope.kitaid,
                "kitaname": $scope.kitaname,
                "description": $scope.kitaDescription,
                "telefon": $scope.kitaTelefon,
                "email": $scope.kitaEmail,
                "ort": $scope.kitaOrt,
                "kanton": $scope.kitaKanton,
                "plz": $scope.kitaPlz,
                "address": $scope.kitaAddress
            }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'kita';
            $state.go('sync');
            alertService.showNotificationSuccesUpdate();
        }, function myError(response) {
            alertService.showNotificationErrorUpdate();
        });
    }

    $scope.onOpenChat = function(){
        $(".chat-window").removeClass('ng-hide');
        $(".chat-window").css({width: '300px', height: '500px', position:'fixed', bottom:'20px', right:'20px', 'z-index':'999999'});
        $(".chatOnlineService").css({display: 'none'});
    }

});