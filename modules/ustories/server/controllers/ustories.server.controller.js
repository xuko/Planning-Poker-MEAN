'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ustory = mongoose.model('Ustory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ustory
 */
exports.create = function(req, res) {
  var ustory = new Ustory(req.body);
  ustory.user = req.user;

  ustory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ustory);
    }
  });
};

/**
 * Show the current Ustory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var ustory = req.ustory ? req.ustory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ustory.isCurrentUserOwner = req.user && ustory.user && ustory.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(ustory);
};

/**
 * Update a Ustory
 */
exports.update = function(req, res) {
  var ustory = req.ustory ;

  ustory = _.extend(ustory , req.body);

  ustory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ustory);
    }
  });
};

/**
 * Delete an Ustory
 */
exports.delete = function(req, res) {
  var ustory = req.ustory ;

  ustory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ustory);
    }
  });
};

/**
 * List of Ustories
 */
exports.list = function(req, res) { 
  Ustory.find().sort('-created').populate('user', 'displayName').exec(function(err, ustories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ustories);
    }
  });
};

/**
 * Ustory middleware
 */
exports.ustoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ustory is invalid'
    });
  }

  Ustory.findById(id).populate('user', 'displayName').exec(function (err, ustory) {
    if (err) {
      return next(err);
    } else if (!ustory) {
      return res.status(404).send({
        message: 'No Ustory with that identifier has been found'
      });
    }
    req.ustory = ustory;
    next();
  });
};
