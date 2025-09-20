// const mongoose = require("mongoose");
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");

// // Prevent overwriting of the User model
// const User = mongoose.models.User || mongoose.model("users", new mongoose.Schema({
//   userId: { type: Number, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// }));

// // Login route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
   
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     // Compare the password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     // Successful login, return the userId (unique ID) from signup
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       userId: user.userId,  // Return the uniqueId here
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to log in. Please try again.",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;
