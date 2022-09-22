const express = require('express');
const carController = require('../controllers/car');

const router = express.Router();

router.post('/', carController.create);

module.exports = router;