const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    numberArtSold: {
        type: Number
    },
    numberArtListed: {
        type: Number
    },
    bestSellers: Array,
});

module.exports = mongoose.model('User', usersSchema);