angular.module('angular-simple-tree', [])

  .directive("treeTemplate", function () {
    return {
      restrict: 'E',
      scope: {
        nodes: '=',
        action: '&'
      },
      transclude: 'true',
      template: '<tree nodes="nodes"></tree>',
      controller: function () {
        this.transclude = null;
        this.action = null;
      },
      link: {
        pre: function (scope, $element, attrs, ctrl, transclude) {
          ctrl.transclude = transclude;
          ctrl.action = scope.action;
        }
      }
    };
  })

  .directive('tree', function () {
    return {
      restrict: 'EA',
      scope: {
        nodes: '='
      },
      require: '^treeTemplate',
      link: function (scope, $element, attrs, ctrl) {
        scope.action = function (params) {
          ctrl.action({params: params});
        };

        ctrl.transclude(scope, function (clone) {
          $element.append(clone);
        });
      }
    };
  })
