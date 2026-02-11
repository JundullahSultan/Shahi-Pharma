// create_user.js
const mongoose = require('mongoose');
const User = require('./models/Users.js'); // 1. Import your User model

// 2. Database Connection (Replace with your actual DB URI)
const dbURI =
  'mongodb+srv://jundullah:sultanmongo@jundullah.kwysoto.mongodb.net/v1?appName=Jundullah';

const createUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbURI);
    console.log('✅ Connected to database...');

    // 3. Define the User Data
    const newUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456', // NOTE: If your model hashes passwords, this will work automatically
      role: 'admin',
    });

    // 4. Save to Database
    const savedUser = await newUser.save();
    console.log('🎉 User created successfully:', savedUser);
  } catch (err) {
    console.error('❌ Error creating user:', err.message);
  } finally {
    // 5. Close the connection so the script stops running
    mongoose.connection.close();
    console.log('🔌 Connection closed.');
    process.exit();
  }
};

// Execute the function
createUser();
