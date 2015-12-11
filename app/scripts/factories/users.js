'use strict';

angular.module('mcApp')
    .factory('users',function(){
        var user = {};

        user.seed=1337;
        user.sims=100000;
        user.inflation = 0.032;
        user.discount = 0.032;

        return user;
    });