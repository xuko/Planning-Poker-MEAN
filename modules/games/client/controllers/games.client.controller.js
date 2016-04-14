(function() {
    'use strict';

    // Games controller
    angular
        .module('games')
        .controller('GamesController', GamesController);

    GamesController.$inject = ['$scope', '$state', '$q', '$timeout', 'Authentication', 'gameResolve', 'Users'];

    function GamesController($scope, $state, $q, $timeout, Authentication, game, Users) {
        var vm = this;

        vm.authentication = Authentication;
        vm.game = game;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

        vm.readonly = false;
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = querySearch;
        vm.contacts = Users.query();
        vm.selectedPlayers = [];
        vm.numberChips = [];
        vm.numberChips2 = [];
        vm.numberBuffer = '';
        vm.transformChip = transformChip;


        var v = 0;
        for (var i = vm.game.ustories.length - 1; i >= 0; i--) {
            for (var j = vm.game.ustories[i].values.length - 1; j >= 0; j--) {
                v += parseInt(vm.game.ustories[i].values[j].value);
            }
            vm.game.ustories[i].score = v / vm.game.ustories[i].values.length;
            v = 0;
        }


        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }
            // Otherwise, create a new one
            return {
                username: chip,
                email: 'new'
            }
        }
        /**
         * Search for vegetables.
         */
        /*    function querySearch (query) {
              var results = query ? vm.contacts.filter(createFilterFor(query)) : [];
              return results;
            }*/
        /**
         * Create filter function for a query string
         */
        /*    function createFilterFor(query) {
              var lowercaseQuery = angular.lowercase(query);
              return function filterFn(contact) {
                return (contact.username.indexOf(lowercaseQuery) === 0) ||
                    (contact.email.indexOf(lowercaseQuery) === 0);
              };
            }*/
        function loadContacts(usrs) {


            return usrs.map(function(cont) {
                cont._lowerusername = cont.username.toLowerCase();
                cont._loweremail = cont.email.toLowerCase();
                return cont;
            });
        }



        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;

        vm.allContacts = Users.query();
        vm.filterSelected = true;
        vm.querySearch = querySearch;
        vm.delayedQuerySearch = delayedQuerySearch;
        /**
         * Search for contacts; use a random delay to simulate a remote call
         */
        function querySearch(criteria) {
            cachedQuery = cachedQuery || criteria;
            return cachedQuery ? vm.allContacts.filter(createFilterFor(cachedQuery)) : [];
        }
        /**
         * Async search for contacts
         * Also debounce the queries; since the md-contact-chips does not support this
         */
        function delayedQuerySearch(criteria) {
            cachedQuery = criteria;
            if (!pendingSearch || !debounceSearch()) {
                cancelSearch();
                return pendingSearch = $q(function(resolve, reject) {
                    // Simulate async search... (after debouncing)
                    cancelSearch = reject;
                    $timeout(function() {
                        resolve(vm.querySearch());
                        refreshDebounce();
                    }, Math.random() * 500, true)
                });
            }
            return pendingSearch;
        }

        function refreshDebounce() {
            lastSearch = 0;
            pendingSearch = null;
            cancelSearch = angular.noop;
        }
        /**
         * Debounce if querying faster than 300ms
         */
        function debounceSearch() {
            var now = new Date().getMilliseconds();
            lastSearch = lastSearch || now;
            return ((now - lastSearch) < 300);
        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(contact) {
                return (contact.username.indexOf(lowercaseQuery) != -1);;
            };
        }

        function loadContacts() {
            var contacts = [
                'Marina Augustine',
                'Oddr Sarno',
                'Nick Giannopoulos',
                'Narayana Garner',
                'Anita Gros',
                'Megan Smith',
                'Tsvetko Metzger',
                'Hector Simek',
                'Some-guy withalongalastaname'
            ];
            return contacts.map(function(c, index) {
                var cParts = c.split(' ');
                var contact = {
                    name: c,
                    email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase() + '@example.com',
                    image: 'http://lorempixel.com/50/50/people?' + index
                };
                contact._lowername = contact.name.toLowerCase();
                return contact;
            });
        }

        function play() {
          for (var i = 0; i < $scope.ustories.length; i++) {
              $scope.ustories[i].values = [];
          }
          $state.go('games.play', {
              gameId: vm.game._id
          });
        }







        if (vm.game._id) {
            vm.selectedPlayers = vm.game.players;
        } else {
            vm.selectedPlayers = [user];
        }

        if (vm.game._id) {
            $scope.ustories = vm.game.ustories;
        } else {
            $scope.ustories = [];
        }


        $scope.addUstory = function() {
            $scope.ustories.push({
                name: $scope.ustoryname,
                description: $scope.ustorydescription
            });

            // Clear input fields after push
            $scope.ustoryname = "";
            $scope.ustorydescription = "";
        }

        $scope.removeUstory = function(index) {
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
            vm.game.players = vm.selectedPlayers;
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
