const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const barberauth = require("./routes/Barber_Routes/barberauths");
const barbershopsRouter = require("./routes/Barber_Routes/barbershop");
const timingsRouter = require("./routes/Barber_Routes/timing");
const barbersRouter = require("./routes/Barber_Routes/styles");
const searchRouter = require("./routes/User_Routes/search"); // Adjust the path if necessary
const Userauth = require("./routes/User_Routes/Userauth");
const Booking_Route = require("./routes/User_Routes/Booking_Route");
const Remaining_time = require("./routes/User_Routes/Remaining_time");
const Bookinghistory = require('./routes/User_Routes/Bookinghistory');
const ProfileRoute = require('./routes/Barber_Routes/Profile_Route');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust based on your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Mount routers
app.use("/api", barberauth); // Covers /api/signup, /api/login, /api/logout, /api/checkvaliduser, /api/dashboard
app.use("/api/barbershops", barbershopsRouter); // /api/barbershops
app.use("/api/timings", timingsRouter);
app.use("/api",timingsRouter) // /api/timings/save-timings/:uniqueId
app.use("/api/barbers", barbersRouter); // /api/barbers

// User Routes
app.use("/api", searchRouter);
app.use('/api/barbers', searchRouter);
app.use('/api/auth', Userauth);
app.use('/api',Booking_Route);
app.use('/api',Remaining_time);
app.use('/api',Bookinghistory);
app.use("/api", ProfileRoute);



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://sachin:sachin003@cluster0.qlnyk.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});