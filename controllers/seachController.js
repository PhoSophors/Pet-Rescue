// controllers/searghController.js:

const { validationResult } = require('express-validator');
const Post = require('../models/postModel');
const User = require('../models/userModel');

// SEARCH POST =====================================================================
exports.searchPosts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let { search } = req.query;
    console.log('Search query:', search); // Log the search query for debugging

    if (!search || typeof search !== 'string') {
      return res.status(400).json({ message: 'Search query must be a non-empty string' });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { discription: { $regex: search, $options: 'i' } }
      ]
    });

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found' });
    }

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// SEARCH USERS =====================================================================
exports.searchUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { search } = req.query;
    console.log('Search query:', search); // Log the search query for debugging

    if (!search || typeof search !== 'string') {
      return res.status(400).json({ message: 'Search query must be a non-empty string' });
    }

    const users = await User.find({ username: { $regex: search, $options: 'i' } });

    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};