import mongoose from 'mongoose';
import { mongoUrl } from '../config';

mongoose.connect(mongoUrl);
function connectionError() {
  console.warn('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
}

mongoose.connection.on('error', connectionError);
module.exports = mongoose;
