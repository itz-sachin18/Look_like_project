const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../../model/barber/barberschema') // Adjust the path to your User model


// Middleware to verify JWT Token (Authorization header)
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to verify JWT Token (Cookie-based)
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 
  console.log(token);
  if (!token) {
    console.log("false");
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// User Signup Route
router.post('/signup', async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    console.log("User model:", User);
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    console.log("User model:", User);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a unique adminId (6 random characters)
    const adminId = `ADM-${uuidv4().slice(0, 6).toUpperCase()}`;

    user = new User({ fullName, email, password: hashedPassword, adminId });

    await user.save();
    console.log("User created successfully:", user);

    res.status(201).json({ message: "User registered successfully", adminId });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Generating JWT token...");
    const token = jwt.sign({ userId: user._id, adminId: user.adminId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Change to true in production (HTTPS required)
      sameSite: "Lax",
    });

    // Include uniqueId in the response
    res.json({ success: true, token, userId: user._id, adminId: user.adminId, uniqueId: user.uniqueId || user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Logout Route
router.post('/logout', (req, res) => {
  console.log("Before logout:", req.cookies);
  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" }); // Adjusted to match login cookie settings
  console.log("After logout:", req.cookies);
  res.json({ success: true, message: "Logged out successfully!" });
});

// Check Valid User Route
router.get('/checkvaliduser', verifyToken, (req, res) => {
  console.log("user in...");
  res.json({ success: true, message: "User is valid", user: req.user });
});

// Protected Dashboard Route
router.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: "Welcome to the dashboard", adminId: req.user.adminId });
});

module.exports = router;