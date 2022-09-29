const express = require('express');
const carController = require('../controllers/car');
const isAuth = require ('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, carController.all);
router.post('/', isAuth, carController.create);

module.exports = router;