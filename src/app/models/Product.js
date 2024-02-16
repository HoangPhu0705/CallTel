const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  productName: {
    type: String,
    required: true,
  },
  importPrice: {
    type: String,
    required: true,
  },
  retailPrice: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  quantityInStock: {
    type: Number,
    default: 0,
  },
  quantitySold: {
    type: Number,
    required: true,
    default: 0,
  },
  ram: {
    type: Number,
    required: true,
  },
  storage: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  color: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
