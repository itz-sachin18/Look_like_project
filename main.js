const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/barbershop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String, // No encryption for simplicity (not recommended for production)
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Create a new user
  const newUser = new User({ fullName, email, password });
  await newUser.save();
  res.json({ message: "User registered successfully!" });
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and check password
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ success: true, message: "Login successful!", userId: user._id });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
