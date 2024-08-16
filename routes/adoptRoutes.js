
const express = require('express');
const router = express.Router();
const userAdoptController = require('../controllers/userAdoptController');
const { authMiddleware, checkRoleMiddleware } = require("../middlewares/authMiddleware");

// Common middleware for authenticated routes with role checking
const commonMiddleware = [authMiddleware, checkRoleMiddleware(['user', 'admin'])];

// ADOPT POST ================================================================================================
router.post("/adopt-post", commonMiddleware, userAdoptController.adopt);

module.exports = router;