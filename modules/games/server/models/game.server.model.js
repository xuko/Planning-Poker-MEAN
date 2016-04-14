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
    players: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    playersIn: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    ustories: {
        type: [{
            name: String,
            description: String,
            values: [{
                user: {
                    type: Schema.ObjectId,
                    ref: 'User'
                },
                score: String
            }],
            score: String
        }],
        default: [],
        ref: 'Ustory'
    }
});

mongoose.model('Game', GameSchema);
