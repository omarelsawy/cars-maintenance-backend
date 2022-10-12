const express = require('express');
const maintenanceController = require('../controllers/maintenance');

const router = express.Router();

router.get('/', maintenanceController.all);
router.get('/:id', maintenanceController.show);
router.post('/', maintenanceController.create);

module.exports = router;