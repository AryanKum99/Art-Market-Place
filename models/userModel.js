const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const usersSchema = new Schema({
    username: {
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
        type: Number,
        default: 0
    },
    bestSellers: Array,
    isSeller: {
        type: Boolean,
        default: false
    },
    cart: {
        type: [String],
        default: []
    },
    cartTotal:{
        type: Number,
        default: 0
    }
});
usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', usersSchema);