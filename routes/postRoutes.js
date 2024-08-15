const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authMiddleware, checkRoleMiddleware } = require("../middlewares/authMiddleware");

// Common middleware for authenticated routes with role checking
const commonMiddleware = [authMiddleware, checkRoleMiddleware(['user', 'admin'])];

// POSTS ================================================================================================
router.post('/create-pet-post', commonMiddleware, postController.createPost);
router.post('/update-pet-post/:id', commonMiddleware, postController.updatePost);
router.post('/delete-pet-post/:id', commonMiddleware, postController.deletePost);

// GER POSTS ================================================================================================
router.get('/get-all-pet-posts', postController.getAllPosts);
router.get('/get-pet-post-by-id/:id', postController.getPostById);
router.get('/get-pet-post-by-user', authMiddleware, postController.getPostsByUser);

module.exports = router;