describe('myController', function () {
  beforeEach(module('myapp'));

  var $controller, $rootScope;

  beforeEach(inject(function (_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('nodes', function () {
    it('should be updated in controller if changed in nodesService', function () {
      var nodes = [];

      var nodesService = {
        GetNodes: function () {
          return nodes;
        }
      };

      var $scope = $rootScope.$new();
      $controller('myController', {$scope: $scope, nodesService: nodesService});

      $scope.$apply(function () {
        nodes.push({name: 'fda'});
      });

      expect($scope.nodes).toEqual(nodesService.GetNodes());
    });
  });
});


describe('Tree Recursive Directive', function () {
  var $compile,
    $rootScope;

  beforeEach(module('myapp'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe('"treeTemplate"', function () {
    it('should show template content if it does not contain tree directive', function () {
      var element = $compile('<tree-template nodes="nodes"><p>Title</p></tree-template>')($rootScope);
      $rootScope.$digest();

      var containingParagraphs = element.find('p');
      expect(containingParagraphs.length).toBe(1);
      expect(containingParagraphs[0].outerText).toBe('Title');
    });

    it('should create "p" element for every node', function () {
      $rootScope.nodes = [{nodes: [{}]}, {}];

      var element = $compile('<tree-template nodes="nodes"><div ng-repeat="node in nodes"><p>Title</p><tree nodes="node.nodes"></tree></div></tree-template>')($rootScope);
      $rootScope.$digest();

      var containingParagraphs = element.find('p');
      expect(containingParagraphs.length).toBe(3);
    });
  });


  describe('"tree"', function () {
    it('action launch passed action', function () {
      var changed = '';
      $rootScope.action = function (params) {
        changed = params.testParam;
      };

      var element = $compile('<tree-template nodes="nodes" action="action(params)"><button ng-click="action({testParam: \'testValue\'})"></button></tree-template>')($rootScope);
      $rootScope.$digest();

      element.find('button')[0].click();
      expect(changed).toBe('testValue');
    });
  });
});


describe('nodesService', function () {
  var nodesService,
    $rootScope;

  beforeEach(module('myapp'));

  beforeEach(inject(function (_$rootScope_, _nodesService_) {
    $rootScope = _$rootScope_;
    nodesService = _nodesService_;
    localStorage.clear();
  }));

  describe('"GetNodes()"', function () {
    it('should return valid values', function () {
      var nodes = nodesService.GetNodes();
      nodes.length = 0;

      expect(nodesService.GetNodes().length).toBe(0);

      nodes.push({});
      expect(nodesService.GetNodes().length).toBe(1);
    });
  });

  describe('"saveState"', function () {
    it('should save valid values to localStorage', function () {
      var node = {name: "testName"};
      var nodes = nodesService.GetNodes();
      nodes.length = 0;
      nodes.push(node);

      $rootScope.$broadcast('savestate');
      expect(localStorage.nodesService).toBe(angular.toJson([node]));
    });
  });

  describe('"restoreState"', function () {
    it('should restore valid values from localStorage', function () {
      var node = {name: "testName"};
      localStorage.nodesService = angular.toJson([node]);
      $rootScope.$broadcast('restorestate');

      expect(angular.toJson(nodesService.GetNodes())).toBe(angular.toJson([node]));
    });
  });

});
