const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,

    },
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String
    },
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Community', communitySchema);