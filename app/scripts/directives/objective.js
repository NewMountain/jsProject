'use strict';

angular.module('mcApp')
  .directive('objective',function(){
    return{
        templateUrl: 'views/investment-objectives.html',
        controller: 'TabsDemoCtrl'
    };
  });