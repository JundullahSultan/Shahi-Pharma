require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/Users'); // Path to your User model
const connectDB = require('./config/db'); // Path to your DB config

const createOwner = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Define Owner Details
    const ownerData = {
      name: "SuperOwner",
      pharmacy: "Shahi Pharma HQ",
      email: "owner@owner.com",
      password: "owner123", // Change this!
      role: "owner"
    };

    // 3. Check if owner already exists
    const existingOwner = await User.findOne({ email: ownerData.email });
    if (existingOwner) {
      console.log("Owner already exists!");
      process.exit();
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(ownerData.password, 10);

    // 5. Save to Database
    const owner = new User({
      ...ownerData,
      password: hashedPassword
    });

    await owner.save();
    console.log("Owner created successfully!");
    console.log("Email:", ownerData.email);
    
    process.exit();
  } catch (error) {
    console.error("Error creating owner:", error.message);
    process.exit(1);
  }
};

createOwner();