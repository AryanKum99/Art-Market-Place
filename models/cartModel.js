const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CartItemSchema = new Schema({
    product: {
        // type: mongoose.Schema.ObjectId, 
        type: String,
        ref: 'Product'
    },
    status: {
        type: String,
        default: 'Not processed',
        enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    price: Number,
    username: String
});


module.exports = mongoose.model('CartItem', CartItemSchema);