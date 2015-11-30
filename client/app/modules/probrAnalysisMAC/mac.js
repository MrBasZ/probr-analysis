'use strict';

angular.module('probrAnalysisMAC', [
    'ui.router',
    'ui.bootstrap',
    'probrPagination',
    'probrAnalysisCommon',
    'ngCookies'
]).config(function ($stateProvider) {
    $stateProvider
        .state('mac', {
            url: '/mac?:startTimestamp&:endTimestamp&:tags',
            templateUrl: 'app/modules/probrAnalysisMAC/mac/mac.html',
            controller: 'MacCtrl'
        })
        .state('mac-history', {
            url: '/mac/history/{macaddress}?:startTimestamp&:endTimestamp&:tags',
            templateUrl: 'app/modules/probrAnalysisMAC/mac/history.html',
            controller: 'HistoryCtrl'
        })
        .state('mac-location', {
            url: '/mac/location/{macaddress}?:startTimestamp&:endTimestamp&:tags',
            templateUrl: 'app/modules/probrAnalysisMAC/mac/location.html',
            controller: 'LocationCtrl'
        });
});
