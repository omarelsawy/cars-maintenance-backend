const express = require('express');
const { body } = require('express-validator');
const carController = require('../controllers/car');
const isAuth = require ('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, carController.all);
router.get('/:id', isAuth, carController.show);
router.post('/', isAuth, 
    [
        body('name')
            .notEmpty()         
    ]
    , carController.create);

module.exports = router;