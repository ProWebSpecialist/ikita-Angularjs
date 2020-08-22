angular.module('calendar').service('CalendarService', function (AuthService, $window, $http, $state, $rootScope, alertService) {

    var calender_events;

    this.resizeEvent = function (event, delta, revertFunc, jsEvent) {

        $http({
            method: "PUT",
            url: "calendar/editEvent/",
            data: {
                id: event.id,
                title: element.title,
                start: element.start + "",
                end: element.end + "",
                color: element.color,
                textColor: element.textColor,
                userId: $rootScope.decodedToken.userid,
                userName: $rootScope.decodedToken.username,
                groupid: element.className
            }
        }).then(function mySuccess(response) {
            $state.reload();
        });

    };

    this.dayClick = function(date, jsEvent, view, events ){
       // console.log("Here is start and end =>", start, end);

       $rootScope.modalTitle = "Neues Event hinzufügen";
       $rootScope.modalSuccesBtn = "Bestätigen"
       $rootScope.modalLink = "newEvent";

       
       var dateComponentStart = date.utc().format('MM/DD/YYYY');
       $rootScope.startDate = new Date(dateComponentStart);
       $rootScope.startTime = '08:00';

       var dateComponentEnd = date.utc().format('MM/DD/YYYY');
       $rootScope.endDate = new Date(dateComponentEnd);
       $rootScope.endTime = '17:00';

       $("#eventTitle").text("");
       $("#eventName").val("");
       $("#bColor").val("#000000");
       $("#fColor").val("#ffffff");

       $('#Modal').modal('show');

       calender_events = events;
       //console.log("selection's events =>", events);
    }

    this.selectionClick = function (start, end, jsEvent, view, events) {

        // console.log("Here is start and end =>", start, end);

        $rootScope.modalTitle = "Neues Event hinzufügen";
        $rootScope.modalSuccesBtn = "Bestätigen"
        $rootScope.modalLink = "newEvent";

        var date = moment(start);
        var dateComponentStart = date.utc().format('MM/DD/YYYY');
        var timeComponentStart = date.format('HH:mm');
        $rootScope.startDate = new Date(dateComponentStart);
        $rootScope.startTime = timeComponentStart;

        date = moment(end - 1);
        var dateComponentEnd = date.utc().format('MM/DD/YYYY');
        var timeComponentEnd = date.format('HH:mm');
        $rootScope.endDate = new Date(dateComponentEnd);
        $rootScope.endTime = timeComponentEnd;

        $rootScope.date_start = start;
        $rootScope.date_end = end;

        $("#eventTitle").text("");
        $("#eventName").val("");
        $("#bColor").val("#000000");
        $("#fColor").val("#ffffff");

        $('#Modal').modal('show');

        calender_events = events;
        //console.log("selection's events =>", events);

    }

    $rootScope.newEventConfirm = function () {

        //  console.log(calender_events[0].events);
        var newEvent_groupID;

        if (calender_events[0].events === undefined) {
            calender_events[0].events = [];
        }

        var length_events = calender_events[0].events.length;

     

        if ($rootScope.groupSelect === undefined ){  // This mean that groupSelect is array []
            $rootScope.groupSelect = $('#groupNames option:selected').val();
        }

     
        if (length_events == 0) {
            calender_events[0].events.push({
                id: 0,
                title: $("#eventName").val(),
                color: $("#bColor").val(),
                textColor: $("#fColor").val(),
                start: $rootScope.date_start,
                end: $rootScope.date_end,
                className: $rootScope.groupSelect
            });
        } else {
            calender_events[0].events.push({
                id: calender_events[0].events[length_events - 1].id + 1,
                title: $("#eventName").val(),
                color: $("#bColor").val(),
                textColor: $("#fColor").val(),
                start: $rootScope.date_start,
                end: $rootScope.date_end,
                className: $rootScope.groupSelect
            });
        }


        $http({
            method: "POST",
            url: "calendar/newEvent/",
            data: {
                title: $("#eventName").val(),
                start: $rootScope.date_start + "",
                end: $rootScope.date_end + "",
                color: $("#bColor").val(),
                textColor: $("#fColor").val(),
                userId: $rootScope.decodedToken.userid,
                userName: $rootScope.decodedToken.username,
                groupid: $rootScope.groupSelect
            }
        }).then(function mySuccess(response) {

        });

    }

    var current_event_id;

    $rootScope.editEventConfirm = function () {
        // this data can be saved into database

        //   console.log("current event id =>", current_event_id, calender_events);
        //   console.log("this is windows object =>", $window );
        //   console.log("status =>", $state);

        if (calender_events === undefined) {

            $rootScope.eventsByGroup.forEach(element => {
                if (element.id == current_event_id) {
                    element.title = $("#eventName").val();
                    element.color = $("#bColor").val();
                    element.textColor = $("#fColor").val();

                    var s_Date, e_Date;

                    s_Date = $("#startDate").val() + "T" + $("#startTime").val();
                    e_Date = $("#endDate").val() + "T" + $("#endTime").val();

                    //         console.log(s_Date + "  " + e_Date);
                    element.start = (new Date(s_Date)).getTime();
                    element.end = (new Date(e_Date)).getTime();

                    /*    
                        element.start = $rootScope.date_start;
                        element.end = $rootScope.date_end;
                    */
                    //    console.log($rootScope.groupSelect);
                    element.className = $rootScope.groupSelect;
                    //$window.FullCalendar.Calendar("updateEvent", element);
                }
            });

        } else {
            calender_events[0].events.forEach(element => {
                if (element.id == current_event_id) {
                    element.title = $("#eventName").val();
                    element.color = $("#bColor").val();
                    element.textColor = $("#fColor").val();

                    var s_Date, e_Date;

                    s_Date = $("#startDate").val() + "T" + $("#startTime").val();
                    e_Date = $("#endDate").val() + "T" + $("#endTime").val();

                    element.start = $rootScope.date_start;
                    element.end = $rootScope.date_end;

                    element.className = $rootScope.groupSelect;
                }
            });
            $rootScope.setEventSource(calender_events[0].events);
        }

        //        console.log("EventSource => ", $rootScope);

        $rootScope.eventsByGroup.forEach(element => {
            if (element.id == current_event_id) {
                $http({
                    method: "PUT",
                    url: "calendar/editEvent/",
                    data: {
                        id: current_event_id,
                        title: element.title,
                        start: element.start + "",
                        end: element.end + "",
                        color: element.color,
                        textColor: element.textColor,
                        userId: $rootScope.decodedToken.userid,
                        userName: $rootScope.decodedToken.username,
                        groupid: element.className
                    }
                }).then(function mySuccess(response) {
                    $state.reload();
                });
            }
        });

    }

    $rootScope.deleteEventConfirm = function () {

        $http({
            method: "GET",
            url: "calendar/deleteEvent/" + current_event_id
        }).then(function mySuccess(response) {
            $state.reload();
        });

    }

    this.eventClick = function (event, jsEvent, view, events) {
        $rootScope.modalLink = "editEvent";
        $rootScope.modalTitle = "Event bearbeiten";
        $rootScope.modalSuccesBtn = "Bestätigen"
        $rootScope.eventName = event.title;

        calender_events = events;

        //Start
        var date = moment(event.start._i);
        var dateComponentStart = date.utc().format('MM/DD/YYYY');
        var timeComponentStart = date.utc().format('HH:mm');
        $rootScope.startDate = new Date(dateComponentStart);
        $rootScope.startTime = timeComponentStart;

        //Ende
        var date = moment(event.end._i - 1);
        var dateComponentEnd = date.utc().format('MM/DD/YYYY');
        var timeComponentEnd = date.utc().format('HH:mm');
        $rootScope.endDate = new Date(dateComponentEnd);
        $rootScope.endTime = timeComponentEnd;

        $rootScope.date_start = event.start;
        $rootScope.date_end = event.end;

        current_event_id = event.id;
        $rootScope.color = event.color;
        $rootScope.textColor = event.textColor;

        /* ---- */
        var current_group_id;

        $rootScope.eventsByGroup.forEach(element => {
            if (element.id == event.id)
                current_group_id = element.className;
        });

        /* ---- */

        $rootScope.changeOption(current_group_id);

        $rootScope.eventTitle = event.title;

        $("#eventName").val(event.title);
        $("#bColor").val(event.color);
        $("#fColor").val(event.textColor);

        $('#Modal').modal('show');
    }


    this.isLogAdmin = function () {
        if (AuthService.isloggedIn()) {
            if ($rootScope.decodedToken.usertype == 1) {
                return true;
            }
        } else {
            return false;
        }
    }

});