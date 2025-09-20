const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Prevent Overwriting Model
const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// Login Route
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("uuuuuuuu",user)
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({ success: true, message: "Login successful", uniqueId: user.uniqueId });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Failed to log in. Please try again.", error: error.message });
  }
});

module.exports = router;
