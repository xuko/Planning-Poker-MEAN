(function () {
  'use strict';

  angular
    .module('games')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('games.play', {
        url: '/:gameId/play',
        templateUrl: 'modules/games/client/views/play.client.view.html',
        controller: 'PlayController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: getGame
        },
        data:{
          pageTitle: 'Playing {{ articleResolve.name }}'
        }
      })
      .state('games', {
        abstract: true,
        url: '/games',
        template: '<ui-view/>'
      })
      .state('games.list', {
        url: '',
        templateUrl: 'modules/games/client/views/list-games.client.view.html',
        controller: 'GamesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Games List'
        }
      })
      .state('games.create', {
        url: '/create',
        templateUrl: 'modules/games/client/views/form-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: newGame
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Games Create'
        }
      })
      .state('games.edit', {
        url: '/:gameId/edit',
        templateUrl: 'modules/games/client/views/form-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: getGame
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Game {{ gameResolve.name }}'
        }
      })
      .state('games.view', {
        url: '/:gameId',
        templateUrl: 'modules/games/client/views/view-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: getGame
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Game {{ articleResolve.name }}'
        }
      });
  }

  getGame.$inject = ['$stateParams', 'GamesService'];

  function getGame($stateParams, GamesService) {
    return GamesService.get({
      gameId: $stateParams.gameId
    }).$promise;
  }

  newGame.$inject = ['GamesService'];

  function newGame(GamesService) {
    return new GamesService();
  }
})();
