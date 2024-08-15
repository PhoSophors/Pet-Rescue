
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, checkRoleMiddleware } = require("../middlewares/authMiddleware");

// Register user =========================================
router.post("/register", userController.register);
router.post("/register-verify-otp", userController.verifyOTP);
router.post("/login", userController.userLogin);

// Forgot password =========================================
router.post("/request-new-password", userController.requestResetPassword);
router.post("/verify-new-password-otp", userController.verifyResetPasswordOTP);
router.post("/set-new-password", userController.setNewPassword);

// User profile =========================================
router.get("/get-user-profile", authMiddleware, userController.getUserProfile);
router.post("/update-user-profile", authMiddleware, checkRoleMiddleware(["user"]), userController.updateProfile);

module.exports = router;