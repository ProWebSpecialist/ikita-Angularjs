angular.module('iKita').service('uploadFileService', function ($http) {
  this.upload = function(file){
    var fd = new FormData();
    fd.append('myFile', file.upload);

    return $http.post('/upload', fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type' : undefined}    
    })
  }
});