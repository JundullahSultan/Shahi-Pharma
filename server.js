require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const adminRuotes = require('./routes/admin.js');
const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.js');
const connectDB = require('./config/db.js');

const app = express();

// Allows express to read JSON bodies sent from JavaScript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', authRoutes);
app.use('/admin', adminRuotes);
app.use('/user', userRoutes);

connectDB();
app.listen(3000);
