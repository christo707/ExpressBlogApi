import mongoose from 'mongoose';
import Comment from './comment';
import User from './user';
let Schema = mongoose.Schema;

let Post = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

module.exports = mongoose.model('Post', Post);
