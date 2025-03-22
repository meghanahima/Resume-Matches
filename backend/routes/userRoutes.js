const express = require("express");
const router = express.Router();
const User = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");
const JobDescription = require("../schema/jobDescriptionModel");

// Register User
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      gender,
      githubProfileUrl,
      linkedinProfileUrl,
      frontendURL,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      gender,
      githubProfileUrl,
      linkedinProfileUrl,
      emailVerificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      isEmailVerified: false,
    });

    console.log("User created:", user);

    // Send verification email
    await sendVerificationEmail(frontendURL, email, emailVerificationToken);

    if (user) {
      res.status(201).json({
        success: true,
        message: "Registration successful. Please verify your email.",
        _id: user._id,
        name: user.name,
        email: user.email,
        emailVerificationExpires: user.emailVerificationExpires,
        isEmailVerified: false,
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Verify Email
router.get("/verify-email/:token", async (req, res) => {
  try {
    // Add logging for debugging
    console.log("Verifying token:", req.params.token);

    const user = await User.findOne({
      emailVerificationToken: req.params.token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
      });
    }

    // Update verification status
    user.isEmailVerified = true;
    await user.save();

    console.log("User after save:", user);

    // Clean up tokens in the background
    process.nextTick(async () => {
      try {
        const userToUpdate = await User.findById(user._id);
        if (userToUpdate) {
          // userToUpdate.emailVerificationToken = undefined;
          // userToUpdate.emailVerificationExpires = undefined;
          await userToUpdate.save();
        }
      } catch (err) {
        console.error("Token cleanup error:", err);
      }
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({
      success: false,
      message: "Verification failed",
    });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, frontendURL } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken, frontendURL);

    res
      .status(200)
      .json({ success: true, message: "Password reset link sent to email" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
        emailVerificationExpires: user.emailVerificationExpires,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      res.json({
        success: true,
        ...user,
        // _id: user._id,
        // name: user.name,
        // email: user.email,
        // mobile: user.mobile,
        token: generateToken(user._id),
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get User Profile (Protected Route Example)
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Profile
router.put("/update-profile", protect, async (req, res) => {
  try {
    console.log("Update profile request body:", req.body);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create update object with only valid fields
    const updateFields = {};
    const allowedFields = ['name', 'mobile', 'gender', 'githubProfileUrl', 'linkedinProfileUrl', 'profilePic'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    console.log("Fields to update:", updateFields);

    // Update user with the new fields
    Object.assign(user, updateFields);
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        gender: updatedUser.gender,
        githubProfileUrl: updatedUser.githubProfileUrl,
        linkedinProfileUrl: updatedUser.linkedinProfileUrl,
        profilePic: updatedUser.profilePic,
        isEmailVerified: updatedUser.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

// Update Password
router.put("/update-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Save Job
router.post("/save-job", protect, async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Initialize savedJobs array if it doesn't exist
    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    // Check if job is already saved
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Job already saved",
      });
    }

    // Add jobId to the beginning of savedJobs array
    user.savedJobs.unshift(jobId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Job saved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get Saved Jobs
router.get("/saved-jobs", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get job details for all saved jobs
    const savedJobs = await JobDescription.find({
      _id: { $in: user.savedJobs || [] },
    });

    res.status(200).json({
      success: true,
      savedJobs,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Remove Saved Job
router.delete("/saved-jobs/:jobId", protect, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Remove jobId from savedJobs array
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Job removed from saved jobs",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Add this route to remove profile picture
router.put("/remove-profile-pic", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.profilePic = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture removed successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Resend Verification Email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email, frontendURL } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Update user with new token and expiry
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Resend verification email
    console.log("emailVerificationToken", emailVerificationToken);
    await sendVerificationEmail(frontendURL, email, emailVerificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email has been resent",
      emailVerificationExpires: user.emailVerificationExpires, // Return the new expiry time
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
