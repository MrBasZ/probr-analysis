'use strict';

angular.module('probrAnalysisMAC')
  .controller('HistoryCtrl', function ($scope, $state, $stateParams, SessionConcurrency, PunchcardData) {

    $scope.datePickerDate = {startDate: new Date().getTime(), endDate: new Date().getTime() - (1000 * 60 * 60 * 24)};
    $scope.macaddress = $stateParams["macaddress"];

    $scope.lineHidden = false;
    $scope.cardHidden = true;

    $scope.toggleLine = function () {
      $scope.lineHidden = false;
      $scope.cardHidden = true;
    }

    $scope.toggleCard = function () {
      $scope.lineHidden = true;
      $scope.cardHidden = false;
    }

    // n3-line charts
    $scope.data = [];
    $scope.options = {
      axes: {x: {type: "date", ticksFormat: "%A", ticksInterval: d3.time.day}},
      stacks: [{axis: "y", series: ["id_0"]}],
      lineMode: "cardinal",
      series: [{
        id: "id_0",
        y: "val_0",
        label: "Sessions",
        type: "column",
        color: "#1f77b4"
      }]
    };

    $scope.query = function () {

      if ($scope.datePickerDate.endDate.valueOf() - $scope.datePickerDate.startDate.valueOf() < (1000 * 60 * 60 * 24)) {
        $scope.options.axes = {x: {type: "date", ticksFormat: "%H:%M", ticks: 24, ticksInterval: d3.time.hour}};
      } else {
        $scope.options.axes = {x: {type: "date", ticksFormat: "%H:%M", ticks: 7, ticksInterval: d3.time.day}};
      }

      SessionConcurrency.query({start: $scope.datePickerDate.startDate.valueOf(), end: $scope.datePickerDate.endDate.valueOf(), mac_address: $scope.macaddress}, function (result, err) {

        // Fill D3-LineChart
        $scope.data = [];

        result.forEach(function (entry) {
          $scope.data.push({x: new Date(entry["_id"]), val_0: entry["value"]})
        });

        // Fill PunchCard
        var dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        $scope.days = [];
      });

    }

    $scope.query();

    PunchcardData.query({mac_address_src: $scope.macaddress}, function (resultObj) {

      //intialize the array for the days
      var dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      $scope.days = [];

      //initialize the punchcard data with zeros
      var punchCardData = [];
      for (var i = 0; i < 7; i++) {
        punchCardData[i] = new Array(24);
        for (var k = 0; k < 24; k++) {
          punchCardData[i][k] = 0;
        }
      }

      resultObj.forEach(function (entry) {
        var day = entry["_id"].split("_")[0];
        var hour = entry["_id"].split("_")[1];
        punchCardData[day][hour] = entry["value"];
      });


      $scope.punchCardData = [];

      //find out at which day punchcard starts
      var startDay = (new Date()).getDay();

      var k = 0;
      for (var i = 0; i < 7; i++) {
        var dayIndex = (startDay + i) % 7;
        var dayName;
        if (dayIndex === 0) {
          dayName = "Sunday";
          dayIndex = 7;
        } else {
          dayName = dayList[dayIndex - 1];
        }
        $scope.days.push(dayName);
        $scope.punchCardData.push(punchCardData[dayIndex - 1]);

      }

      console.log($scope.punchCardData);

    });

  });
