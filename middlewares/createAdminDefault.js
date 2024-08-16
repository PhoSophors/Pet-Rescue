const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const User = require('../models/userModel');

async function createDefaultAdmin() {
  const adminExists = await User.findOne({ roles: "admin" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Create a new admin user
    const admin = new User({
      username: "admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      roles: ["admin"],
      isVerified: true,
    });

    await admin.save();

    // Generate access token
    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d", 
    });

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "70d", // longer lifespan
      }
    );

    // Save the refresh token to the database
    admin.refreshToken = refreshToken;
    await admin.save();

    console.log('Default admin user created');
    console.log({ accessToken, refreshToken });
  } else {
    console.log('Admin user already exists');
  }
}

module.exports = createDefaultAdmin;