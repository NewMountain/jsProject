'use strict';

angular.module('mcApp')
  .directive('financials',function(){
    return{
        templateUrl: 'views/financial-info.html',
        controller: 'TabsDemoCtrl'
    };
  });