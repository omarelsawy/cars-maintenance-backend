const express = require('express');
const employeeController = require('../controllers/employee');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', employeeController.all);
router.get('/orders', employeeController.orders);
router.post('/', employeeController.create);

module.exports = router;