'use strict';

angular.module('mcApp')
  .directive('tax',function(){
    return{
        templateUrl: 'views/tax-info.html',
        controller: 'TabsDemoCtrl'
    };
  });