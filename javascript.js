const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  stock: Number,
  aiTags: [String] // Để AI hiểu sản phẩm
});

module.exports = mongoose.model('Product', ProductSchema);