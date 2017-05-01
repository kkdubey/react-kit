/*eslint-disable */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    advertiser: {
      type: String,
    },
    customer_id: {
      type: String,
    },
  },
	{
    timestamps: true
  });

User.virtual('userId').get(function () {
  return this.id;
});

module.exports = mongoose.model('User', User);
