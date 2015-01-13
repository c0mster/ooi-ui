var phonecatApp = angular.module('platforms', []);

phonecatApp.controller('PlatformListCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('/stations_new.json').success(function(data) {
    $scope.phones = data.CP;
  });

  // $scope.orderProp = 'age';
}]);