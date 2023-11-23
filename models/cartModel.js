const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CartItemSchema = new Schema({
    product: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Product'
    },
    quantity: Number,
    status: {
        type: String,
        default: 'Not processed',
        enum: ['Not processed' , 'Processing', 'Shipped', 'Delivered', 'Cancelled']},
    netCost: Number
  });


module.exports = mongoose.model('CartItem', CartItemSchema);