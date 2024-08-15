const Post = require("../models/postModel");
const User = require("../models/userModel");
const { upload, deleteFileFromS3 } = require("../config/S3Client");

// CREATE PET POST =================================================================
exports.createPost = [
  upload.array("images", 1), // Limit to 1 image

  async (req, res) => {
    const { title, discription, sex, age, vaccine } = req.body;

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "Fail to create post",
        message: "Images are required",
      });
    }

    const images = req.files.map((file) => file.location); // Get S3 URLs

    // Validate post
    if (!title || !discription || images.length === 0) {
      return res.status(400).json({
        status: "Fail to create post",
        message: "Title, description, and images are required",
      });
    }

    try {
      // Create post
      const newPost = await Post.create({
        title,
        discription,
        sex,
        age,
        vaccine,
        images,
        user: req.user._id,
      });

      // Update user's posts array
      const user = await User.findById(req.user._id);
      user.posts.push(newPost._id);
      await user.save();

      res.status(201).json({
        status: "Success",
        data: {
          post: newPost,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },
];

// Get all pet posts =================================================================
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    if (!posts) {
      return res.status(404).json({
        status: "fail",
        message: "No posts found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully.",
      data: {
        posts,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      status: "fail",
      message: "Fail to get all posts",
      error: error.message,
    });
  }
};

// UPDATE POST =================================================================
exports.updatePost = [
  upload.array("images", 1), // Limit to 1 image

  async (req, res) => {
    const { title, discription, sex, age, vaccine } = req.body;

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "Fail to update",
        message: "Images are required",
      });
    }

    const images = req.files.map((file) => file.location); // Get S3 URLs

    // Validate update
    if (!title || !discription || images.length === 0) {
      return res.status(400).json({
        status: "Fail to update",
        message: "Title, discription and images are required",
      });
    }

    try {
      // Find the post to update
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          status: "Fail to update",
          message: "Post not found",
        });
      }

      // Delete old images from S3
      if (post.images && post.images.length > 0) {
        const deletePromises = post.images.map((imageUrl) => {
          const key = imageUrl.split("/").pop(); // Extract key from URL
          return deleteFileFromS3(key);
        });
        await Promise.all(deletePromises);
      }

      // Update post
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title,
          discription,
          sex,
          age,
          vaccine,
          images,
        },
        { new: true }
      );

      res.status(200).json({
        status: "Success",
        data: {
          post: updatedPost,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  },
];

// Get Post by ID =================================================================
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Get who posted the post
    const user = await User.findById(post.user);

    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Post retrieved successfully.",
      data: {
        user,
        post,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      status: "fail",
      message: "Fail to get post",
      error: error.message,
    });
  }
};

// GET POSTS BY USER ===========================================================
exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id });

    // Get user posts count
    const postsCount = posts.length;

    if (!posts) {
      return res.status(404).json({
        status: "fail",
        message: "No posts found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully.",

      data: {
        postsCount,
        posts,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      status: "fail",
      message: "Fail to get posts",
      error: error.message,
    });
  }
};


// DELETE POST =================================================================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        status: "Fail to delete",
        message: "Post not found",
      });
    }

    // Delete images from S3
    if (post.images && post.images.length > 0) {
      const deletePromises = post.images.map((imageUrl) => {
        const key = imageUrl.split("/").pop(); // Extract key from URL
        return deleteFileFromS3(key);
      });
      await Promise.all(deletePromises);
    }

    // Use deleteOne instead of remove
    await Post.deleteOne({ _id: post._id });

    // Delete post from user's posts array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: post._id },
    });

    res.status(200).json({
      status: "success",
      message: "Delete Successfully.",
      data: null,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({
      status: "Fail to delete",
      message: error.message,
    });
  }
};
