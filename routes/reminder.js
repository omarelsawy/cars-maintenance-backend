const express = require('express');
const reminderController = require('../controllers/reminder');

const router = express.Router();

router.post('/', reminderController.create);
router.get('/', reminderController.all);

module.exports = router;