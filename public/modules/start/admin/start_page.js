angular.module('kita').controller('startCtrl', function (AuthService, $rootScope, $scope, $http, alertService, $window, $state) {
    
    var kitas = [];

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
            //    console.log("element value =>", element._id);
                kitas.push({value: element._id, text: element.groupname});
            });
            $rootScope.groupNames = kitas;
        });
        $scope.selected =  kitas[0];    // show default value here for options
        $scope.kitas = kitas;           // pass the data into scope
        
     });

     $scope.hasChanged = function(){
       // console.log($scope.selected);
       // alert($scope.selected.text + "   " + $scope.selected.value);

        if ($scope.selected >= -1){
            //Here we would like to show kid's info

            kids = [];

            $http({
                method: "GET",
                url: "user/getUsersByGroup/" + $scope.selected,
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

});