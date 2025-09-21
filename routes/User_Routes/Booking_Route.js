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
router.get('/api/bookings/barber/:barberId', async (req, res) => {
  try {
    const { barberId } = req.params;

    // Get the current date (May 17, 2025, in your case)
    const currentDate = new Date(); // This will be May 17, 2025, 05:27 PM IST as per the system time
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Start of May 17, 2025 (00:00:00)
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // End of May 17, 2025 (23:59:59)

    // Find bookings for the given barberId where bookingDate falls on the current date
    const bookings = await Booking.find({
      barberId,
      bookingDate: {
        $gte: startOfDay, // Greater than or equal to the start of the day
        $lte: endOfDay,   // Less than or equal to the end of the day
      },
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;