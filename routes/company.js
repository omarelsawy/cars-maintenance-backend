const express = require('express');
const maintenanceRoutes = require('./maintenance');
const carRoutes = require('./car');
const userRoutes = require('./user');
const orderRoutes = require('./order');

const router = express.Router();

router.use('/maintenance', maintenanceRoutes);
router.use('/cars', carRoutes);
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);

module.exports = router;