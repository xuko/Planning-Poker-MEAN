(function () {
  'use strict';

  angular
    .module('games')
    .controller('GamesListController', GamesListController);

  GamesListController.$inject = ['GamesService'];

  function GamesListController(GamesService) {
    var vm = this;

    vm.games = GamesService.query();
    vm.remove = remove;

    function remove(game, index) {
    	if (confirm('Are you sure you want to delete?')) {
        	game.$remove();
        	vm.games.splice(index, 1); // UPDATE THE VIEW
    	}	
    }
  }
})();
