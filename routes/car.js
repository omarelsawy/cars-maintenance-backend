const express = require('express');
const { body } = require('express-validator');
const carController = require('../controllers/car');

const router = express.Router();

router.get('/', carController.all);
router.get('/:id', carController.show);
router.post('/', 
    [
        body('name')
            .notEmpty()         
    ]
    , carController.create);

module.exports = router;