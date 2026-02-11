const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const auth = require('../middleware/auth.js');

router.get('/login', userController.userLogin);
router.get('/dashboard', auth.verifyUser, userController.sendDashboard);

router.post('/login', userController.userLoginVerify);
router.get('/logout', auth.verifyUser, userController.userLogut);

router.post('/dashboard', auth.verifyUser, userController.createOrder);

router.get('/orders', auth.verifyUser, userController.getMyOrders);

module.exports = router;
