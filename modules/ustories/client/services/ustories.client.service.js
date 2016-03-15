//Ustories service used to communicate Ustories REST endpoints
(function () {
  'use strict';

  angular
    .module('ustories')
    .factory('UstoriesService', UstoriesService);

  UstoriesService.$inject = ['$resource'];

  function UstoriesService($resource) {
    return $resource('api/ustories/:ustoryId', {
      ustoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
