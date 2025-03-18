const express = require('express');
const maintenanceRoutes = require('./maintenance');
const carRoutes = require('./car');
const userRoutes = require('./user');
const orderRoutes = require('./order');
const reminderRoutes = require('./reminder');
const employeeRoutes = require('./employee');

const router = express.Router();

router.use('/maintenance', maintenanceRoutes);
router.use('/cars', carRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/reminders', reminderRoutes);
router.use('/employees', employeeRoutes);

module.exports = router;