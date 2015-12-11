'use strict';

angular.module('mcApp')
  .directive('simulation',function(){
    return{
        templateUrl: 'views/simulation-info.html',
        controller: 'TabsDemoCtrl'
    };
  });