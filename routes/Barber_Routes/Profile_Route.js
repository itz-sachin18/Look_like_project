
const express = require("express");
const router = express.Router();

const NewShop = require("../../model/barber/shop");
const BarberTiming = require("../../model/barber/time");
router.get("/profile/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;

    // Log the received adminId for debugging
    console.log("Received adminId:", adminId);

    // Use aggregation to fetch shop details and join with barbertimeings
    const profileData = await NewShop.aggregate([
      // Step 1: Match the shop by adminId
      {
        $match: { adminId },
      },
      // Step 2: Lookup barbertimeings using uniqueId
      {
        $lookup: {
          from: "barbertimeings", // The collection name in MongoDB (case-sensitive, typically lowercase)
          localField: "uniqueId",
          foreignField: "uniqueId",
          as: "barberTimings",
        },
      },
      // Step 3: Project the required fields
      {
        $project: {
          adminId: 1,
          uniqueId: 1,
          shopName: 1,
          email: 1,
          createdAt: 1,
          barberTimings: {
            $map: {
              input: "$barberTimings",
              as: "timing",
              in: { barberId: "$$timing.barberId" },
            },
          },
        },
      },
    ]);

    // Step 4: Check if a shop was found
    if (!profileData || profileData.length === 0) {
      return res.status(404).json({ message: "Shop not found for this admin." });
    }

    // Step 5: Return the first (and only) document from the aggregation result
    res.status(200).json(profileData[0]);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
