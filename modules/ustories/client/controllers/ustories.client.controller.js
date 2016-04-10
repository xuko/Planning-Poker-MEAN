(function () {
  'use strict';

  // Ustories controller
  angular
    .module('ustories')
    .controller('UstoriesController', UstoriesController);

  UstoriesController.$inject = ['$scope', '$state', 'Authentication', 'ustoryResolve'];

  function UstoriesController ($scope, $state, Authentication, ustory, game) {
    var vm = this;

    vm.authentication = Authentication;
    vm.ustory = ustory;
    vm.game = game;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Ustory
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.ustory.$remove($state.go('ustories.list'));
      }
    }

    // Save Ustory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ustoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.ustory._id) {
        vm.ustory.$update(successCallback, errorCallback);
        vm.game.ustories.$update(successCallback, errorCallback);
      } else {
        vm.ustory.$save(successCallback, errorCallback);
        vm.game.ustories.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('ustories.view', {
          ustoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
