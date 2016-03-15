'use strict';

/**
 * Module dependencies
 */
var ustoriesPolicy = require('../policies/ustories.server.policy'),
  ustories = require('../controllers/ustories.server.controller');

module.exports = function(app) {
  // Ustories Routes
  app.route('/api/ustories').all(ustoriesPolicy.isAllowed)
    .get(ustories.list)
    .post(ustories.create);

  app.route('/api/ustories/:ustoryId').all(ustoriesPolicy.isAllowed)
    .get(ustories.read)
    .put(ustories.update)
    .delete(ustories.delete);

  // Finish by binding the Ustory middleware
  app.param('ustoryId', ustories.ustoryByID);
};
