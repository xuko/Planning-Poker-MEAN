'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ustory Schema
 */
var UstorySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Ustory name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Ustory', UstorySchema);
