'use strict';

/**
 * @ngdoc overview
 * @name mcApp
 * @description
 * # mcApp
 *
 * Main module of the application.
 */
angular
  .module('mcApp', [
    'ngRoute',
    'ui.bootstrap',
    'ui.utils.masks'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/monte-carlo', {
        templateUrl: 'views/monte-carlo.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
