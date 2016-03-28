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
