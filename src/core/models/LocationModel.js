const textSearch = require('mongoose-text-search');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Location = new Schema({
  criteria_id: {
    type: Number,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  canonical_name: {
    type: String,
    required: true,
  },
  parent_id: {
    type: String,
  },
  country_code: {
    type: String,
    required: true,
  },
  location_type: {
    type: String,
    required: true,
  },
});
Location.plugin(textSearch);
Location.index({ name: 'text' });
module.exports = mongoose.model('Location', Location);
