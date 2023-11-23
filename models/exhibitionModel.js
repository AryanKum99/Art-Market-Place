const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExhibitionSchema = new Schema({
  artName: {
    type: mongoose.Schema.ObjectId, 
    ref: 'Product'
  },
  image: {
    type: mongoose.Schema.ObjectId, 
    ref: 'Product'
  },
  description: {
    type: mongoose.Schema.ObjectId, 
    ref: 'Product'
  },
  created: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User'
  },
});

module.exports = mongoose.model('Exhibit', ExhibitionSchema);