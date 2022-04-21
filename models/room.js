const mongoose = require("mongoose")
const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      required: [true, 'price 必填'],
    },
    rating: Number,
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
    // timestamps: true
  }
);

const Room = mongoose.model('room', roomSchema);

module.exports = Room