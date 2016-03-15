(function () {
  'use strict';

  angular
    .module('ustories')
    .controller('UstoriesListController', UstoriesListController);

  UstoriesListController.$inject = ['UstoriesService'];

  function UstoriesListController(UstoriesService) {
    var vm = this;

    vm.ustories = UstoriesService.query();
  }
})();
