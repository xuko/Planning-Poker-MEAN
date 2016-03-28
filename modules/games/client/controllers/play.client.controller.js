(function() {
  'use strict';

  angular
    .module('games')
    .controller('PlayController', PlayController);

  PlayController.$inject = ['$scope', '$state', 'Authentication', 'gameResolve'];

  function PlayController($scope, $state, Authentication, game) {
    var vm = this;
    vm.game = game;
    // Play controller logic
    // ...

    init();

    function init() {
    }
  }
})();
