const express = require('express');
const userController = require('../controllers/user');
const { body } = require('express-validator/check');

const router = express.Router();

router.post('/get-token',
    [
        body('email')
            .isEmail(),
        body('password')
            .notEmpty()
    ], 
    userController.getToken
);

module.exports = router;