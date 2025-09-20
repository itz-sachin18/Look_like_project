// const mongoose = require("mongoose");
// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");

// // Auto-increment plugin for generating unique userId
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// // Define the schema for storing users
// const userSchema = new mongoose.Schema({
//   userId: Number, // Auto-incremented ID
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // Apply auto-increment plugin to the userSchema
// userSchema.plugin(AutoIncrement, { inc_field: "userId" });

// // Create the User model
// const User = mongoose.model("admins", userSchema);

// // Route to sign up a new user
// router.post("/signup", async (req, res) => {
//   const { fullName, email, password } = req.body;

//   try {
//     if (!fullName || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required.",
//       });
//     }

//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already in use.",
//       });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//     });

//     // Save the user to the database
//     await newUser.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully!",
//       userId: newUser.userId,  // Send the unique userId back
//     });
//   } catch (error) {
//     console.error("Error signing up:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to sign up. Please try again.",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;
