import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Account from './account';

let User = new Schema({
  accountid: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', User);
