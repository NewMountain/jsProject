'use strict';

angular.module('mcApp')
  .directive('flows',function(){
    return{
        templateUrl: 'views/flow-info.html',
        controller: 'TabsDemoCtrl'
    };
  });