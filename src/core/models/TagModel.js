const textSearch = require('mongoose-text-search');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tag = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  data: {
    type: Schema.Types.Mixed,
  },
});

Tag.plugin(textSearch);
Tag.index({ name: 'text' });

module.exports = mongoose.model('Tag', Tag);
