(function() {
    'use strict';

    angular
        .module('games')
        .controller('GamesListController', GamesListController);

    GamesListController.$inject = ['Authentication', 'GamesService'];

    function GamesListController(Authentication, GamesService) {
        var vm = this;

        vm.authentication = Authentication;
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
