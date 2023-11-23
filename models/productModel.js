const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    artName: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    listedBy: {
        type: String,
        required: true
    },
    image: String,

});

module.exports = mongoose.model('Product', productsSchema);