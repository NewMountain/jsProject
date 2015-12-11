'use strict';

angular.module('mcApp')
  .directive('goals',function(){
    return{
        templateUrl: 'views/goal-info.html',
        controller: 'TabsDemoCtrl'
    };
  });