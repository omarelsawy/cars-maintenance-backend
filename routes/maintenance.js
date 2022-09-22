const express = require('express');
const maintenanceController = require('../controllers/maintenance');

const router = express.Router();

router.get('/', maintenanceController.all);
router.post('/', maintenanceController.create);

module.exports = router;