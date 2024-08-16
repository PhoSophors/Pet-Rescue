// controllers/userAdoptController.js:

const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const Post = require('../models/postModel');

// ADOPT POST =====================================================================
exports.adopt = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, postId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is already adopted
    if (post.adoptedBy) {
      return res.status(400).json({ message: 'Post already adopted' });
    }

    // Update post to reflect adoption
    post.adoptedBy = userId;
    await post.save();

    res.json({ message: 'Post successfully adopted', post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};