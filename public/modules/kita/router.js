angular.module('kita').config(function($stateProvider) {

    var registerState = {
        name: 'register',
        url: 'kita/register',
        templateUrl : "modules/kita/kita_view/register_view.html"
      }

      var editUserState = {
        name: 'editUser',
        url: 'kita/editUser',
        templateUrl : "modules/kita/kita_view/kita_edituser_view.html"
      }

      var feedbackState = {
        name: 'feedbackUser',
        url: 'kita/feedback',
        templateUrl : "modules/kita/kita_view/kita_feedback_view.html"
      }

     
      $stateProvider.state(registerState);
      $stateProvider.state(editUserState);
      $stateProvider.state(feedbackState);

});