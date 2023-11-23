const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    numberArtBought: {
        type: Number
    },
    numberArtSold: {
        type: Number
    },
    numberArtListed: {
        type: Number
    },
    bestSellers: Array,
});

usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', usersSchema);