'use strict';

/* App Module */

var CAApp = angular.module('CAApp', [
    'ngRoute',
    'wilddog',
    
    'CAControllers',
    'CAServices',
    'CAFilters',
]);

CAApp.config(function($routeProvider) {
	$routeProvider.
		when('/homework', {
			templateUrl: './template/homework-list.html',
			controller: 'HomeworkCtrl'
		}).
		when('/homework-new', {
			templateUrl: './template/homework-new.html',
			controller: 'HomeworkNewCtrl'
		}).
		when('/homework-edit/id=:id', {
			templateUrl: './template/homework-edit.html',
			controller: 'HomeworkEditCtrl'
		}).
		when('/clock', {
			templateUrl: './template/time.html',
			controller: 'TimeCtrl'
		}).
		when('/timetable', {
			templateUrl: './template/timetable.html',
			controller: 'TimetableCtrl'
		}).
		otherwise({
			redirectTo: '/homework'
		});
});