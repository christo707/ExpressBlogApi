import mongoose from 'mongoose';
import User from './user';
import Post from './post';
const Schema = mongoose.Schema;

let Comment = new Schema({
  message: {
    type: String,
    required: true
  },
  dateCreated: {
    type : Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postid: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
});

module.exports = mongoose.model('Comment', Comment);
