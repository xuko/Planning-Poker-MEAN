(function() {
  'use strict';

  // Games module config
  angular
    .module('games')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Config logic
    // ...
  }
})();
