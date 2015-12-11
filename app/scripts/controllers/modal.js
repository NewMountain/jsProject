'use strict';

angular.module('mcApp')
  .controller('ModalDemoCtrl', function ($scope, $uibModal, $log, $window, goals, models, users, cashFlows) {

    $scope.goals = goals;
    $scope.user = users;
    $scope.models = models;
    $scope.cashFlows = cashFlows;

    $scope.Math = window.Math;

    $scope.animationsEnabled = true;

    var calcInflation = function(i){
      return Math.pow((users.inflation)+1,i);
    };

    $scope.inflateUp = function(i){
      var adj = calcInflation(i);
      cashFlows.simulation[i].inflExp = (cashFlows.simulation[i].presExp * adj);
      return cashFlows.simulation[i].inflExp;
    };

    $scope.inflateDown = function(i){
      var adj = calcInflation(i);
      cashFlows.simulation[i].presExp = (cashFlows.simulation[i].inflExp / adj);
      return cashFlows.simulation[i].presExp;
    };

    $scope.open = function (size, i) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'views/modal.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          ind: i
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };

})
  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, ind, goals, models, users, cashFlows) {

    $scope.goals = goals;
    $scope.user = users;
    $scope.models = models;
    $scope.cashFlows = cashFlows;
    $scope.ind = ind;


    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
