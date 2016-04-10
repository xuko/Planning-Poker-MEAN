(function () {
  'use strict';

  // Games controller
  angular
    .module('games')
    .controller('GamesController', GamesController);

  GamesController.$inject = ['$scope', '$state', 'Authentication', 'gameResolve'];

  function GamesController ($scope, $state, Authentication, game) {
    var vm = this;

    vm.authentication = Authentication;
    vm.game = game;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    if (vm.game._id) {
        $scope.players = vm.game.players;
      } else {
        $scope.players = [];
      }

    if (vm.game._id) {
        $scope.ustories = vm.game.ustories;
      } else {
        $scope.ustories = [];
      }


    $scope.addUstory = function () {
      $scope.ustories.push({
        name: $scope.ustoryname,
        description: $scope.ustorydescription
    });

    // Clear input fields after push
    $scope.ustoryname = "";
    $scope.ustorydescription = "";
    }

    $scope.removeUstory = function (index) {
      $scope.ustories.splice(index, 1);
    }


    // Remove existing Game
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.game.$remove($state.go('games.list'));
      }
    }

    // Save Game
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gameForm');
        return false;
      }
      vm.game.players = $scope.players;
      vm.game.ustories = $scope.ustories;
      // TODO: move create/update logic to service
      if (vm.game._id) {
        vm.game.$update(successCallback, errorCallback);
      } else {
        vm.game.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('games.view', {
          gameId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
