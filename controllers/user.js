const User = require('../models/Users');
const Order = require('../models/Orders');
const Medicine = require('../models/Medicines');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.userLogin = (req, res) => {
  res.render('user/login');
};

exports.userLoginVerify = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'user')
      return res.status(403).json({ message: 'Users only' });

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // 3. Sign jwt
    const payload = { id: user._id, username: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60,
    });

    res.redirect('/user/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.sendDashboard = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const user = await User.findById(req.user.id);

    res.render('user/user-medicine', { medicines, user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createOrder = async (req, res) => {
  try {
    // 1. Get User ID from the session (Assumes you use Passport.js or similar auth)
    // If you are using simple sessions, it might be req.session.userId
    const user = req.user.id;

    const { medicineId, quantity, price } = req.body;

    if (!user || !medicineId || !quantity || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const totalPrice = price * quantity;

    // 3. Create the new Order object
    const newOrder = new Order({
      user: user, // Links to the logged-in user
      medicineId: medicineId, // Links to the specific medicine
      quantity: quantity,
      status: 'Pending', // Optional, since default is already 'Pending'
      price: price,
      totalPrice,
    });

    // 4. Save to Database
    await newOrder.save();

    // 5. Send success response back to frontend
    res.status(200).send('Order placed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error placing order');
  }
};

exports.userLogut = (req, res) => {
  res.clearCookie('token');
  res.redirect('/user/login');
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id; // From middleware

    // Populate is crucial here to see Medicine Names!
    const orders = await Order.find({ user: userId })
      .populate('medicineId')
      .sort({ createdAt: -1 }); // Newest first

    res.render('user/user-orders', {
      orders,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
