const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imageSchema = new Schema({
    url: String,
    fileName: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
})
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
        required: true,
        default: Date.now()
    },
    listedBy: {
        type: String,
        required: true
    },
    image: [imageSchema],
});

module.exports = mongoose.model('Product', productsSchema);