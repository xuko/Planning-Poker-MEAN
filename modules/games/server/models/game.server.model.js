'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Game Schema
 */
var GameSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Game name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  uStories: {
    type: [Schema.ObjectId],
    ref: 'Ustory',
    default: [],
    required: 'Please Add User Stories'
  }
});

mongoose.model('Game', GameSchema);
