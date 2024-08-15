const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String
  },
  otpExpiration: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  refreshToken: {
    type: String,
  },
  roles: [{
    type: String,
    default: ['user'],
  }],
  posts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
  }],
  favorites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Favorites',
  }],
  createdAt: {
    type: Date,
    default: () => {
      const date = new Date();
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    },
  },
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;