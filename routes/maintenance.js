const express = require('express');
const maintenanceController = require('../controllers/maintenance');
const isAuth = require ('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, maintenanceController.all);
router.post('/', isAuth, maintenanceController.create);

module.exports = router;