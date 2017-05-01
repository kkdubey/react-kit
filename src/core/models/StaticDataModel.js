const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaticData = new Schema({
  key: {
    type: String,
    unique: true,
    required: true,
  },
  data: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('StaticData', StaticData);
