'use strict';

angular.module('mcApp')
  .directive('presentation',function(){
    return{
        templateUrl: 'views/presentation.html',
        controller: 'TabsDemoCtrl'
    };
  });