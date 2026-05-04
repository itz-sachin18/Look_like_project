const express = require("express");
const router = express.Router();
const Booking = require("../../model/User/Booking");
const BarberTiming = require("../../model/barber/time");
const shopSchema = require('../../model/barber/shop');
const barberschema = require("../../model/barber/barberschema");

router.post("/bookings", async (req, res) => {
  try {
    const {
      uniqueId,
      userId,
      userName,
      userPhoneNumber,
      userEmail,
      shopName,
      time,
      service,
      barberName,
    } = req.body;

    console.log("Request body:", req.body);

    if (
      !uniqueId ||
      !userId ||
      !userName ||
      !userPhoneNumber ||
      !userEmail ||
      !shopName ||
      !time ||
      !service ||
      !barberName
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userPhoneNumber)) {
      return res.status(400).json({ message: "Please provide a valid 10-digit phone number" });
    }

    console.log("Querying BarberTiming with:", { uniqueId, name: barberName });

    const barber = await BarberTiming.findOne({
      uniqueId: uniqueId.trim(),
      name: { $regex: new RegExp(`^${barberName.trim()}$`, 'i') },
    });

    console.log("Barber found:", barber);

    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    const barberId = barber.barberId;
    console.log("Extracted barberId:", barberId);

    if (!barberId) {
      return res.status(404).json({ message: "BarberId is missing in the barber document" });
    }

    const selectedStyle = barber.styles.find((style) =>
      style.style.localeCompare(service, undefined, { sensitivity: 'base' }) === 0
    );
    if (!selectedStyle) {
      return res.status(404).json({ message: "Selected style not found for this barber" });
    }

    const styleId = selectedStyle.styleId;
    const timing = selectedStyle.timing.value;
    const timingUnit = selectedStyle.timing.unit;
    console.log("Extracted style details:", { styleId, timing, timingUnit });

    const existingBooking = await Booking.findOne({ barberId, time });
    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked for the selected barber" });
    }

    const bookingData = {
      uniqueId,
      barberId: String(barberId), // Ensure barberId is a string
      styleId,
      userId,
      userName,
      userPhoneNumber,
      userEmail,
      shopName,
      time,
      service,
      barberName,
      timing,
      timingUnit,
      bookingDate: new Date(), // Explicitly set the booking date (optional, since schema default works)
      status: "pending", // Explicitly set the status (optional, since schema default works)
    };

    console.log("Booking data before creating new Booking:", bookingData);

    const newBooking = new Booking(bookingData);

    console.log("New booking to save:", newBooking);

    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Example backend route (Express.js)
router.get('/bookings/barber/:barberId', async (req, res) => {
  try {
    const { barberId } = req.params;
    console.log('[Bookings Route] Fetching bookings for barberId:', barberId);

    // Get the current date (May 17, 2025, in your case)
    const currentDate = new Date(); // This will be May 17, 2025, 05:27 PM IST as per the system time
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of May 17, 2025 (00:00:00)
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // End of May 17, 2025 (23:59:59)

    console.log('[Bookings Route] Date range:', startOfDay, '-', endOfDay);

    // Find bookings for the given barberId where bookingDate falls on the current date
    const bookings = await Booking.find({
      barberId,
      bookingDate: {
        $gte: startOfDay, // Greater than or equal to the start of the day
        $lte: endOfDay,   // Less than or equal to the end of the day
      },
    });

    console.log('[Bookings Route] Found', bookings.length, 'bookings');
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Auto-update expired bookings to completed status
router.put('/auto-update-expired', async (req, res) => {
  try {
    const currentDate = new Date();
    console.log('[Bookings Route] Auto-updating expired bookings at:', currentDate.toISOString());

    // Find all pending bookings where bookingDate + time is in the past
    const pendingBookings = await Booking.find({ status: 'pending' });

    const updatePromises = pendingBookings.map(async (booking) => {
      try {
        // Parse booking time: format is "HH:MM AM/PM to HH:MM AM/PM"
        // Example: "2:00 PM to 3:00 PM"
        const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*to\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i;
        const match = booking.time.match(timeRegex);
        
        if (!match) {
          console.error('[Bookings Route] Could not parse time format:', booking.time);
          return;
        }

        const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = match;
        
        // Convert to 24-hour format
        const convertTo24Hour = (hour, period) => {
          let h = parseInt(hour);
          if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
          if (period.toUpperCase() === 'AM' && h === 12) h = 0;
          return h;
        };
        
        const startHour24 = convertTo24Hour(startHour, startPeriod);
        const endHour24 = convertTo24Hour(endHour, endPeriod);
        
        // Create datetime objects for start and end times
        const bookingDateTime = new Date(booking.bookingDate);
        bookingDateTime.setHours(startHour24, parseInt(startMin), 0, 0);
        
        const appointmentEndTime = new Date(booking.bookingDate);
        appointmentEndTime.setHours(endHour24, parseInt(endMin), 0, 0);
        
        console.log('[Bookings Route] Checking booking:', {
          userId: booking.userId,
          appointmentTime: booking.time,
          startTime: bookingDateTime.toISOString(),
          endTime: appointmentEndTime.toISOString(),
          currentTime: currentDate.toISOString(),
          isExpired: appointmentEndTime < currentDate
        });

        // If appointment end time is in the past, mark as completed
        if (appointmentEndTime < currentDate) {
          console.log('[Bookings Route] Marking booking as completed:', booking._id);
          return Booking.findByIdAndUpdate(
            booking._id,
            { status: 'completed' },
            { new: true }
          );
        }
      } catch (err) {
        console.error('[Bookings Route] Error processing booking:', booking._id, err);
      }
    });

    await Promise.all(updatePromises);
    
    res.json({ message: 'Expired bookings updated to completed' });
  } catch (err) {
    console.error("Error auto-updating bookings:", err);
    res.status(500).json({ error: 'Failed to auto-update bookings' });
  }
});

module.exports = router;