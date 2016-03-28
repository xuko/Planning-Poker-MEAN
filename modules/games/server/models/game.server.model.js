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
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  players: {
    type: [String],
    default: [],
    required: 'Add at least one player'
  }
});

mongoose.model('Game', GameSchema);
