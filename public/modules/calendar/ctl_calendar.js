angular.module('calendar').controller('calendarCtrl', function (AuthService, CalendarService, $rootScope, $scope, $http, alertService, $window, $state, uiCalendarConfig) {

  $scope.isLogAdmin = function () {
    if (AuthService.isloggedIn()) {
      if ($rootScope.decodedToken.usertype == 1) {
        return true;
      }
    } else {
      return false;
    }
  }

  $(window).resize(function () {
    $scope.windowWidth = $(window).width();
  });

  if (AuthService.isloggedIn()) {
    $rootScope.isAuth = true;
    $scope.mainGroupid = $rootScope.decodedToken.groupid;
    /*config object */
    $scope.eventSources = [];

    $scope.uiConfig = {
      calendar: {
        lang: 'de',
        height: 750,
        editable: CalendarService.isLogAdmin(),
        selectable: true,
        nowIndicator: true,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function (date, jsEvent, view) {
          CalendarService.dayClick(date, jsEvent, view, $scope.eventSources);
        },
        select: function (start, end, jsEvent, view) {
         if(view.name == 'month'){
          if(end.diff(start, "seconds")>=86401){
            CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
          }else{
            //Do nothing (dayclick handler)
          }
         }else{
          CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
         }
        },
        eventClick: function (event, jsEvent, view) {

          // change the border color just for fun
          $(this).css('border-color', 'blue');
          CalendarService.eventClick(event, jsEvent, view, $scope.eventSources);
        },
        eventResize: function (event, delta, jsEvent, revertFunc) {
          CalendarService.resizeEvent(event, delta, revertFunc, jsEvent);
        },
        eventRender: function (event, element) {
          // CalendarService.eventRender(event, element);
        }
      },
      calendarPad: {
        lang: 'de',
        height: 455,
        editable: CalendarService.isLogAdmin(),
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function () {
          CalendarService.dayClick();
        },
        eventClick: function (event, jsEvent, view) {

          // change the border color just for fun
          $(this).css('border-color', 'blue');
          CalendarService.eventClick(event);
        },
        eventDrop: $scope.alertOnDrop,
        eventResize: function (event, delta, revertFunc) {

          alert(event.title + " end is now " + event.end.format());

          if (!confirm("is this okay?")) {
            revertFunc();
          }
          CalendarService.resizeEvent();
        }


      },
      calendarMobile: {
        lang: 'de',
        height: 400,
        editable: CalendarService.isLogAdmin(),
        header: {
          left: 'month agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function () {
          CalendarService.dayClick();
        },
        eventClick: function (event, jsEvent, view) {

          // change the border color just for fun
          $(this).css('border-color', 'blue');
          CalendarService.eventClick(event);
        },
        eventDrop: $scope.alertOnDrop,
        eventResize: function (event, delta, revertFunc) {

          alert(event.title + " end is now " + event.end.format());

          if (!confirm("is this okay?")) {
            revertFunc();
          }
          CalendarService.resizeEvent();
        }
      }
    };

    var i;
    var group;
    if (CalendarService.isLogAdmin()) {
      $rootScope.kitaGroups = [];
      $http({
        method: "GET",
        url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid,
      }).then(function mySuccess(response) {
        response.data.forEach(element => {
          $rootScope.kitaGroups.push(element._id);
        });

        //Load Groups
        for (group = 0; group < $rootScope.kitaGroups.length; group++) {
          $http({
            method: "GET",
            url: "calendar/getEventsByGroup/" + $rootScope.kitaGroups[group]
          }).then(function mySuccess(response) {
            if (response.data == null) {
              console.log(response.statusText);
            } else {
              var eventsByGroup = [];

              for (i = 0; i < response.data.length; i++) {
                eventsByGroup.push({
                  id: response.data[i]._id,
                  title: response.data[i].title,
                  color: response.data[i].color,
                  textColor: response.data[i].textColor,
                  start: parseInt(response.data[i].start),
                  end: parseInt(response.data[i].end),
                  className: response.data[i].groupid
                });
              }
            }

            $rootScope.eventsByGroup = eventsByGroup;
            $scope.eventSources.push({ events: $rootScope.eventsByGroup });
          }, function myError(error) {
            console.log(error.statusText);
          });
        }
      });
    } else {
      $http({
        method: "GET",
        url: "calendar/getEventsByGroup/" + $rootScope.decodedToken.groupid
      }).then(function mySuccess(response) {
        if (response.data == null) {
          console.log(response.statusText);
        } else {
          var eventsByGroup = [];

          for (i = 0; i < response.data.length; i++) {
            eventsByGroup.push({
              id: response.data[i]._id,
              title: response.data[i].title,
              color: response.data[i].color,
              textColor: response.data[i].textColor,
              start: parseInt(response.data[i].start),
              end: parseInt(response.data[i].end),
              className: response.data[i].groupid
            });
          }
        }

        $rootScope.eventsByGroup = eventsByGroup;
        $scope.eventSources.push({ events: $rootScope.eventsByGroup });
      }, function myError(error) {
        console.log(error.statusText);
      });
    }

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

    $rootScope.setEventSource = function (events) { // Update All events in calendar
      // alert('this functins called!!!');
      //$scope.eventSources.length = 0;

      // $scope.eventSources.splice(0,$scope.eventSources.length);

      // console.log("AAAAAA");
      // console.log("calendar eventSources =>",  $scope.eventSources);

      //$scope.eventSources = [{events : events}];

      // console.log("calendar eventSources =>",  $scope.eventSources);
      // console.log("calendar element =>", uiCalendarConfig.calendars.myCalendar);
      //uiCalendarConfig.calendars.myCalendar.fullCalendar('updateEvents', $scope.eventSources);   
      //
      //uiCalendarConfig.calendars.myCalendar.fullCalendar('updateEvents', []);
    }

  } else {
    $state.go('login');
  }



  $scope.loadEventsGroup = function (groupid) {

    var eventsByGroup = [];
    var i;
    $http({
      method: "GET",
      url: "calendar/getEventsByGroup/" + groupid
    }).then(function mySuccess(response) {
      if (response.data == null) {
        console.log(response.statusText);
      } else {

        for (i = 0; i < response.data.length; i++) {
          eventsByGroup.push({
            id: response.data[i]._id,
            title: response.data[i].title,
            color: response.data[i].color,
            textColor: response.data[i].textColor,
            start: parseInt(response.data[i].start),
            end: parseInt(response.data[i].end),
            className: response.data[i].groupid
          }
          );

        }

        //    console.log(eventsByGroup);
        $rootScope.eventsByGroup = eventsByGroup
        //     console.log($scope);
        $scope.eventSources = [];
        $scope.eventSources.push({ events: $rootScope.eventsByGroup });

      }

    }, function myError(error) {
      console.log(error.statusText);
    });
  }

});