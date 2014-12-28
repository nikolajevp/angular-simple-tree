angular.module('myapp', ['angular-simple-tree', 'nodes-service'])

  .run(function ($rootScope) {
    window.onbeforeunload = function () {
      $rootScope.$broadcast('savestate');
    };
    angular.element(document).ready(function () {
      $rootScope.$broadcast('restorestate');
    });
  })

  .controller('myController', ['$scope', 'nodesService', function ($scope, nodesService) {

    $scope.$watch(nodesService.GetNodes, function () {
      $scope.nodes = nodesService.GetNodes();
    });

    $scope.action = function (params) {
      if (params.actionName === 'add') {
        params.nodes.push({Name: 'Child_' + params.nodes.length, nodes: []});
      } else if (params.actionName === 'delete') {
        var index = params.nodes.indexOf(params.node);
        if (index > -1) {
          params.nodes.splice(index, 1);
        }
      }
    };

  }]);
