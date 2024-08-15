
const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authMiddleware, checkRoleMiddleware } = require("../middlewares/authMiddleware");

// Common middleware for authenticated routes with role checking
const commonMiddleware = [authMiddleware, checkRoleMiddleware(['user', 'admin'])];

// POSTS ================================================================================================
router.post("/add-post-favorite/:postId", commonMiddleware, favoritesController.addFavorite);
router.post("/remove-post-favorite/:postId", commonMiddleware, favoritesController.removeFavorite);

// GET POSTS ================================================================================================
router.get("/get-all-favorites", commonMiddleware, favoritesController.getAllFavorites);

module.exports = router;