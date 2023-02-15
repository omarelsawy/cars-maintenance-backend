const express = require('express');
const orderController = require('../controllers/order');
const { body } = require('express-validator');

const router = express.Router();

router.post('/', orderController.create);
router.get('/', orderController.all);

module.exports = router;