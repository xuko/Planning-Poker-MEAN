(function () {
  'use strict';

  angular
    .module('ustories')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Ustories',
      state: 'ustories',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'ustories', {
      title: 'List Ustories',
      state: 'ustories.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'ustories', {
      title: 'Create Ustory',
      state: 'ustories.create',
      roles: ['user']
    });
  }
})();
