angular.module('nodes-service', [])
  .factory('nodesService', ['$rootScope', function ($rootScope) {

    var nodes = [{
      Id: 1,
      Name: "Contact",
      nodes: [{
        Name: "Testing",
        nodes: []
      }, {
        Name: "More Testing",
        nodes: [{
          Name: '3rd Level',
          nodes: []
        }]
      }]
    }, {
      Id: 1,
      Name: "Contact",
      nodes: []
    }];

    var service = {
      GetNodes: function () {
        return nodes;
      }
    };

    var saveState = function () {
      localStorage.nodesService = angular.toJson(nodes);
    };

    var restoreState = function () {
      if (localStorage.nodesService) {
        $rootScope.$apply(function () {
          nodes = angular.fromJson(localStorage.nodesService);
        });
      }
    };

    $rootScope.$on("savestate", saveState);
    $rootScope.$on("restorestate", restoreState);

    return service;
  }]);
