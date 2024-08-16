// models/postModel.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  discription: {
    type: String,
    required: [true, 'Please provide content'],
  },
  sex: {
    type: String,
    required: [true, 'Please provide sex'],
  },
  age: {
    type: String,
    required: [true, 'Please provide age'],
  },
  vaccine: {
    type: String,
    required: [true, 'Please provide vaccine'],
  },
  createdAt: {
    type: Date,
    default: () => {
      const date = new Date();
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
  },
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;