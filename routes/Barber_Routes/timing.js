const express = require('express');
const router = express.Router();
const Barber = require('../../model/barber/time'); // Adjust the path to your Barber model
const shopSchema = require('../../model/barber/shop')
const BarberTiming = require("../../model/barber/time")

router.post('/save-timings/:uniqueId', async (req, res) => {
  const uniqueId = req.params.uniqueId;  // Extract uniqueId from route parameter
  const data = req.body;  // Extract data from the request body

  console.log("Received data:", uniqueId, data);  // Log to verify

  try {
    // Loop through the data and save each barber's styles with timings
    for (const barberData of data) {
      const { barberName, styles } = barberData;

      // Create a new Barber document
      const barber = new Barber({
        uniqueId,  // Use the uniqueId from the route
        name: barberName,
        styles: styles.map((style) => ({
          style: style.style,
          timing: {
            value: style.timing.value,
            unit: style.timing.unit
          }
        }))
      });

      // Save the barber document to the database
      await barber.save();
    }

    // Send a response when the data is successfully saved
    res.status(200).json({ success: true, message: "Timings saved successfully!" });
  } catch (error) {
    console.error("Error saving timings:", error);
    res.status(500).json({ success: false, message: "Failed to save timings." });
  }
});


router.get("/shops/admin/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const shop = await shopSchema.findOne({ adminId }); // Query newshops by adminId

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json({ uniqueId: shop.uniqueId });
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to get appointments from barbertimeings by uniqueId
router.get("/appointments/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const appointments = await BarberTiming.find({ uniqueId }); // Query barbertimeings by uniqueId

 console.log(appointments);
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;