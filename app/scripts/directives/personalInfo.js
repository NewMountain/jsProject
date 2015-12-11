'use strict';

angular.module('mcApp')
  .directive('personals',function(){
    return{
        templateUrl: 'views/personal-info.html',
        controller: 'TabsDemoCtrl'
    };
  });