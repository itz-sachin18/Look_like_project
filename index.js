const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const timingController = require("./timingController");
const signup = require('./signup');
const login = require('./login');
const sign_u = require('./sign_u');
const login_u = require('./login_u');
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken"); 
require("dotenv").config();
const cookieParser = require("cookie-parser");




// Initialize Express
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this based on your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/barber_shop_db", {

  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
  

// Signup & Login Routes
// app.use("/api", signup);
// app.use("/api", login);

// app.use("/api", login_u);




// Barber Shop Schema

const shopSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  uniqueId: { type: Number,unique:true }, // Required for mongoose-sequence auto-increment
  email: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  ownerContact: { type: String, required: true },
  shopName: { type: String, required: true ,unique: true},
  description: String,
  openHours: String,
  address: { type: String, required: true },
  feedback: [{
    comment: String,
    rating: Number,
    date: { type: Date, default: Date.now }
  }],
  barberNames: { type: [String ], required: true ,
    
  },
  selectedStyles: { type: [String], required: true },

}, { timestamps: true }); // Disabling default ObjectId to use AutoIncrement




/* barber time*/


const styleSchema = new mongoose.Schema({
  style: { type: String, required: true }, // Style name (e.g., Haircut, Shaving)
  timing: {
    value: { type: String, required: true }, // Time value, e.g., "00:30"
    unit: { type: String, required: true, enum: ['H', 'M'] } // Time unit (H for hours, M for minutes)
  }
});

// Schema for Barber's details (uniqueId, name, and styles)
const barberSchema = new mongoose.Schema({
  uniqueId: { type: Number, required: true }, // Barber's unique identifier
  name: { type: String, required: true }, // Barber's name
  styles: [styleSchema] // List of styles with timings
});

const Barber = mongoose.model('Barbertimeing', barberSchema);
/*** */

/***user sc */



// Apply AutoIncrement Plugin
shopSchema.plugin(AutoIncrement, { inc_field: "uniqueId" });

const BarberShop = mongoose.model("newshops", shopSchema);


// app.post("/api/barbershops", async (req, res) => {
//   const { email, ownerName, ownerContact, shopName, description, openHours, address } = req.body;

//  console.log("recieveed data",req.body);
//   try {
//     // Check if shop already exists
//     const existingShop = await BarberShop.findOne({ email });
//     if (existingShop) {
//       return res.status(400).json({ message: "Shop with this email already exists" });
//     }

//     // Create new shop
//     const newShop = new BarberShop({ email, ownerName, ownerContact, shopName, description, openHours, address });
//     const savedShop = await newShop.save();

//     res.status(201).json({ message: "Barber shop registered successfully", shop: newShop ,uniqueId: savedShop.uniqueId});
//   } catch (error) {
//     res.status(500).json({ message: "Error registering shop", error });
//   }
// });


// app.post("/api/barbershops", async (req, res) => {
//   try {
//     console.log("Incoming Request Data:", req.body); // Log incoming data
//     const { email, ownerName, ownerContact, shopName, description, openHours, address } = req.body;

//     // Check if the shop already exists
//     const existingShop = await BarberShop.findOne({ email });
//     if (existingShop) {
//       console.log("Error: Shop with this email already exists");
//       return res.status(400).json({ message: "Shop with this email already exists" });
//     }

//     // Create and save new shop
//     const newShop = new BarberShop({ email, ownerName, ownerContact, shopName, description, openHours, address });
//     const savedShop = await newShop.save();
//     console.log("Shop saved successfully:", savedShop);

//     res.status(201).json({ message: "Barber shop registered successfully", uniqueId: savedShop.uniqueId });
//   } catch (error) {
//     console.error("Server Error:", error); // Log the exact error
//     res.status(500).json({ message: "Error registering shop", error: error.message });
//   }
// });


app.post("/api/barbershops", async (req, res) => {
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

    res.status(201).json({ message: "Barber shop registered successfully", uniqueId: savedShop.uniqueId  });

  } catch (error) {
    console.error("Server Error:", error); // Log the exact error
    res.status(500).json({ message: "Error registering shop", error: error.message });
  }
});




app.post("/api/timings/save-timings/:uniqueId", async (req, res) => {
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


// const User_s = new mongoose.Schema({
//   id: Number, // Auto-incremented ID
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });
// User_s.plugin(AutoIncrement, { inc_field: "id" });
// const User = mongoose.model("Userauth_new", User_s);
// Routes
// app.post("/api/barbers", async (req, res) => {
//   try {
//     const { barberNames, selectedStyles , uniqueId } = req.body;
//   console.log(barberNames, selectedStyles , uniqueId );
//     // Validate input
//     if (!barberNames || !Array.isArray(barberNames) || barberNames.includes("")) {
//       return res.status(400).json({ error: "All barber names are required." });
//     }
//     if (!selectedStyles || !Array.isArray(selectedStyles) || selectedStyles.length === 0) {
//       return res.status(400).json({ error: "At least one style must be selected." });
//     }

//     // Save to database
//     const newBarber = new BarberShop({ barberNames, selectedStyles });
//     await newBarber.save();

//     res.status(201).json({ message: "Barber details added successfully!" });
//   } catch (err) {
//     console.error("Error adding barber details:", err);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });

// app.post("/api/barbers", async (req, res) => {
//   // console.log(barberNames, selectedStyles , uniqueId );
//   try {
//         const { barberNames, selectedStyles , uniqueId } = req.body;
//       console.log(barberNames, selectedStyles , uniqueId );
//         // Validate input
//         if (!barberNames || !Array.isArray(barberNames) || barberNames.includes("")) {
//           return res.status(400).json({ error: "All barber names are required." });
//         }
//         if (!selectedStyles || !Array.isArray(selectedStyles) || selectedStyles.length === 0) {
//           return res.status(400).json({ error: "At least one style must be selected." });
//         }
    
//         // Save to database
//         const newBarber = new BarberShop({ barberNames, selectedStyles });
//         await newBarber.save();
    
//         res.status(201).json({ message: "Barber details added successfully!" });
//       } catch (err) {
//         console.error("Error adding barber details:", err);
//         res.status(500).json({ error: "Internal server error." });
//       }
// })/


app.post("/api/barbers", async (req, res) => {
  try {
    const { barberNames, selectedStyles, uniqueId } = req.body;
    console.log(barberNames, selectedStyles, uniqueId);

    // Validate input
    if (!barberNames || !Array.isArray(barberNames) || barberNames.length === 0) {
      return res.status(400).json({ error: "All barber names are required." });
    }
    if (!selectedStyles || !Array.isArray(selectedStyles) || selectedStyles.length === 0) {
      return res.status(400).json({ error: "At least one style must be selected." });
    }
    if (!uniqueId) {
      return res.status(400).json({ error: "Unique ID is required." });
    }

    // Find the shop by uniqueId and update barberNames and selectedStyles
    const updatedShop = await BarberShop.findOneAndUpdate(
      { uniqueId: uniqueId }, // Find by uniqueId
      { $set: { barberNames, selectedStyles } }, // Update the fields
      { new: true } // Return the updated document
    );

    if (!updatedShop) {
      return res.status(404).json({ error: "Shop not found." });
    }

    res.status(200).json({ message: "Barber details updated successfully!", shop: updatedShop });
  } catch (err) {
    console.error("Error updating barber details:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});


// set timer for styles

app.use("/api/timings", timingController);



// Route to fetch profile data



app.get("/api/search", async (req, res) => {
  try {
      const { query } = req.query;
      if (!query) {
          return res.status(400).json({ message: "Search term is required" });
      }

      // Case-insensitive search
      const results = await BarberShop.find({ shopName: { $regex: query, $options: "i" } });

      res.json(results);
  } catch (error) {
      console.error("Error fetching search results:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// app.post("/api/user/sign_u", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     console.log("uuuuuuuu",user)
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     res.status(200).json({ success: true, message: "Login successful", uniqueId: user.uniqueId });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Failed to log in. Please try again.", error: error.message });
//   }
// });

// app.post("/api/user/login_u", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     console.log("uuuuuuuu",user)
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     const pass = await user.password == password;
//     if(!pass){
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }

//     res.status(200).json({ success: true, message: "Login successful", uniqueId: user.uniqueId });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Failed to log in. Please try again.", error: error.message });
//   }
// });


// app.post("/api/user/sign_u", async (req, res) => {
//   const { fullName ,email, password } = req.body;

//   try {
    
//     const newUser = new User({
//       fullName,
//       email,
//       password,
//     });
//     await newUser.save();

//     res.status(200).json({ success: true, message: "sign in successful"});

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Failed to log in. Please try again.", error: error.message });
//   }
// });

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminId: { type: String, unique: true, default: () => `ADM-${uuidv4().slice(0, 6).toUpperCase()}` }
});

// Create the User model
const User = mongoose.model("newadmins", UserSchema);




app.post("/api/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
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

// **User Login Route**
app.post("/api/login", async (req, res) => {
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

    // ✅ Log Token for Debugging
    console.log("Generated Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Change to true in production (HTTPS required)
      sameSite: "Lax", // Helps with cross-origin requests
    });

    res.json({ success: true, token, userId: user._id, adminId: user.adminId });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// **Logout Route**
app.post("/logout", (req, res) => {
  console.log("Before logout:", req.cookies);
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "Strict" });
  console.log("After logout:", req.cookies);
  res.json({ success: true, message: "Logged out successfully!" });
});


// **Middleware to verify JWT Token**
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


const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 
console.log(token)
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

app.get("/api/checkvaliduser", verifyToken, (req, res) => {
  console.log("user in...");
  res.json({ success:true, message: "User is valid", user: req.user });
});

// **Protected Route (Example: Dashboard)**
app.get("/api/dashboard", authenticate, (req, res) => {
  res.json({ message: "Welcome to the dashboard", adminId: req.user.adminId });
});










const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});