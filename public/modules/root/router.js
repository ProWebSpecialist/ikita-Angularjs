var app = angular.module('iKita').config(function ($stateProvider) {

  // ------------------------------------------------------------------
  //Admin Routes
  // ------------------------------------------------------------------

  var startState = {
    name: 'start',
    url: '/start',
    templateUrl: 'modules/start/admin/start_page.html'
  }

  var calendarState = {
    name: 'kalender',
    url: '/kalender',
    templateUrl: "modules/calendar/calendar_view/calendar.html"
  }

  var kinderState = {
    name: 'kinder',
    url: '/kinder',
    templateUrl: "modules/kita/kinder_view/kinder_view.html"
  }

  var kitaState = {
    name: 'kita',
    url: '/kita',
    templateUrl: "modules/kita/kita_view/kita_view.html"
  }

  $stateProvider.state(startState);
  $stateProvider.state(calendarState);
  $stateProvider.state(kinderState);
  $stateProvider.state(kitaState);


  // ------------------------------------------------------------------
  // Neutral Routes
  // ------------------------------------------------------------------

  var profilState = {
    name: 'profil',
    url: '/profil',
    templateUrl: "modules/user/profil_view/profil_view.html"
  }
  var profilSynState = {
    name: 'sync',
    url: '/sync',
    templateUrl: "modules/root/refreshed_view.html"
  }

  var searchState = {
    name: 'search',
    url: '/search',
    templateUrl: 'modules/nav/main_panel/view_search.html'
  }

  var notificationState = {
    name: 'notification',
    url: '/notification',
    templateUrl: 'modules/nav/main_panel/view_feedback.html'
  }

  $stateProvider.state(profilState);
  $stateProvider.state(profilSynState);
  $stateProvider.state(searchState);
  $stateProvider.state(notificationState);


  // ------------------------------------------------------------------
  //User Routes
  // ------------------------------------------------------------------

  var startUserState = {
    name: 'startUser',
    url: '/Start-User',
    templateUrl: 'modules/start/user/start_page.html'
  }

  var calendarUserState = {
    name: 'kalenderUser',
    url: '/Kalender-User',
    templateUrl: "modules/calendar/calendar_view/calendar.html"
  }

  var kitaUserState = {
    name: 'kitaUser',
    url: '/Kita-Info',
    templateUrl: "modules/kita/kita_view/kita_user_view.html"
  }

  $stateProvider.state(startUserState);
  $stateProvider.state(calendarUserState);
  $stateProvider.state(kitaUserState);

});