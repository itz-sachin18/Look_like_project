// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Routes
const barberauth = require("./routes/Barber_Routes/barberauths");
const barbershopsRouter = require("./routes/Barber_Routes/barbershop");
const timingsRouter = require("./routes/Barber_Routes/timing");
const barbersRouter = require("./routes/Barber_Routes/styles");
const searchRouter = require("./routes/User_Routes/search");
const Userauth = require("./routes/User_Routes/Userauth");
const Booking_Route = require("./routes/User_Routes/Booking_Route");
const Remaining_time = require("./routes/User_Routes/Remaining_time");
const Bookinghistory = require("./routes/User_Routes/Bookinghistory");
const ProfileRoute = require("./routes/Barber_Routes/Profile_Route");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://look-like-project.vercel.app",
  "https://look-like-project-git-main-itz-sachin18s-projects.vercel.app",
  "https://look-like-project-owgmefilr-itz-sachin18s-projects.vercel.app"
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or server-to-server requests
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);


// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", barberauth);
app.use("/api/barbershops", barbershopsRouter);
app.use("/api/timings", timingsRouter);
app.use("/api/barbers", barbersRouter);
app.use("/api", searchRouter);
app.use("/api/barbers", searchRouter);
app.use("/api/auth", Userauth);
app.use("/api", Booking_Route);
app.use("/api", Remaining_time);
app.use("/api", Bookinghistory);
app.use("/api", ProfileRoute);

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb+srv://sachin:sachin003@cluster0.qlnyk.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
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
