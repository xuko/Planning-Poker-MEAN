(function () {
  'use strict';

  angular
    .module('ustories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('ustories', {
        abstract: true,
        url: '/ustories',
        template: '<ui-view/>'
      })
      .state('ustories.list', {
        url: '',
        templateUrl: 'modules/ustories/client/views/list-ustories.client.view.html',
        controller: 'UstoriesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Ustories List'
        }
      })
      .state('ustories.create', {
        url: '/create',
        templateUrl: 'modules/ustories/client/views/form-ustory.client.view.html',
        controller: 'UstoriesController',
        controllerAs: 'vm',
        resolve: {
          ustoryResolve: newUstory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Ustories Create'
        }
      })
      .state('ustories.edit', {
        url: '/:ustoryId/edit',
        templateUrl: 'modules/ustories/client/views/form-ustory.client.view.html',
        controller: 'UstoriesController',
        controllerAs: 'vm',
        resolve: {
          ustoryResolve: getUstory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Ustory {{ ustoryResolve.name }}'
        }
      })
      .state('ustories.view', {
        url: '/:ustoryId',
        templateUrl: 'modules/ustories/client/views/view-ustory.client.view.html',
        controller: 'UstoriesController',
        controllerAs: 'vm',
        resolve: {
          ustoryResolve: getUstory
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Ustory {{ articleResolve.name }}'
        }
      });
  }

  getUstory.$inject = ['$stateParams', 'UstoriesService'];

  function getUstory($stateParams, UstoriesService) {
    return UstoriesService.get({
      ustoryId: $stateParams.ustoryId
    }).$promise;
  }

  newUstory.$inject = ['UstoriesService'];

  function newUstory(UstoriesService) {
    return new UstoriesService();
  }
})();
