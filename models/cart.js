const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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

usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('CartItem', CartItemSchema);