const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../model/User/Userschema');
const router = express.Router();
const Userschema = require('../../model/User/Userschema');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// Register route
router.post('/register', async (req, res) => {
  const { name, phoneNumber, password, email, address } = req.body;
  try {
    let user = await User.findOne({ $or: [{ phoneNumber }, { email }] });
    if (user) {
      return res.status(400).json({ message: 'Phone number or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, phoneNumber, password: hashedPassword, email, address });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Lax' });
    res.status(200).json({ message: 'Login successful' ,userId: user._id,});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Lax' });
  res.json({ success: true, message: 'Logged out successfully!' });
});

// Protected user route
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check valid user route
router.get('/checkvaliduser', verifyToken, (req, res) => {
  console.log("user in...");
  res.json({ success: true, message: "User is valid", user: req.user });
});

module.exports = router;