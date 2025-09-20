// In your server routes file (e.g., routes/bookings.js)
const express = require('express');
const router = express.Router();
const Booking = require('../../model/User/Booking'); // Assuming you have a Booking model

// Get bookings by user ID
router.get('/user/:userId', async (req, res) => {
  console.log(`[Bookings API] Fetching bookings for userId: ${req.params.userId}`);
  
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ bookingDate: -1 })
      .lean(); // Convert to plain JS objects

    console.log(`[Bookings API] Found ${bookings.length} bookings`);
    
    if (!bookings.length) {
      console.log('[Bookings API] No bookings found for user');
      return res.status(200).json({
        success: true,
        message: 'No bookings found',
        bookings: []
      });
    }

    res.json({
      success: true,
      bookings
    });
  } catch (err) {
    console.error('[Bookings API] Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});



// Adjust the path to your Booking model
router.put("/bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Log the incoming userId and status for debugging
    console.log("Received userId:", userId);
    console.log("Received status:", status);

    // Validate status
    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "Status is required and must be a string." });
    }

    // Normalize status to lowercase
    const normalizedStatus = status.trim().toLowerCase();
    if (!["pending", "completed"].includes(normalizedStatus)) {
      return res.status(400).json({ message: "Invalid status value. Allowed values are 'pending' or 'completed'." });
    }

    // Find and update the most recent booking for the userId with status "pending"
    const booking = await Booking.findOneAndUpdate(
      { userId, status: "pending" }, // Match bookings with this userId and status "pending"
      { status: normalizedStatus },
      { 
        new: true, // Return the updated document
        runValidators: true, // Apply schema validators
        sort: { createdAt: -1 } // Sort by createdAt descending to get the most recent booking
      }
    );

    if (!booking) {
      return res.status(404).json({ message: "No pending booking found for this user." });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error: " + error.message });
    }
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;