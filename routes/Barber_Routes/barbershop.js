const express = require('express');
const router = express.Router();
const  BarberShop = require('../../model/barber/shop'); // Adjust the path to your BarberShop model

router.post('/', async (req, res) => {
  try {
    console.log("Incoming Request Data:", req.body); // Log incoming data

    const { adminId, email, ownerName, ownerContact, shopName, description, openHours, address } = req.body;

    // Check if all required fields are present
    if (!adminId || !email || !ownerName || !ownerContact || !shopName || !description || !openHours || !address) {
      console.log("Error: Missing required fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the shop already exists
    const existingShop = await BarberShop.findOne({ email });
    if (existingShop) {
      console.log("Error: Shop with this email already exists");
      return res.status(400).json({ message: "Shop with this email already exists" });
    }

    // Create and save new shop with adminId
    const newShop = new BarberShop({
      adminId,  // Store the admin ID
      email,
      ownerName,
      ownerContact,
      shopName,
      description,
      openHours,
      address
    });

    const savedShop = await newShop.save();
    console.log("Shop saved successfully:", savedShop);

    res.status(201).json({ message: "Barber shop registered successfully", uniqueId: savedShop.uniqueId });

  } catch (error) {
    console.error("Server Error:", error); // Log the exact error
    res.status(500).json({ message: "Error registering shop", error: error.message });
  }
});

module.exports = router;