
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Creative = new Schema({
  identifier: {
    type: String,
    unique: true,
    required: true,
  },
  imageHeight: {
    type: String,
    required: true,
  },
  imageWidth: {
    type: String,
    required: true,
  },
  cdnUrl: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  });

module.exports = mongoose.model('Creative', Creative);

