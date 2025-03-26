const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Service = require('../models/service');

exports.getToken = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('validation error');
        error.statusCode = 422;
        return next(error);
    }

    const email = req.body.email;
    const password = req.body.password;

    let user = await User.findOne({'email': email})
        .populate({
            path: 'company',
            select: "name slug",
            populate: {
                path: 'service',
                select: "name",
            }
        })

    if(!user){
        const error = new Error('user not found')
        error.statusCode = 401
        return next(error);
    }
    
    let isEqual = await bcrypt.compare(password, user.password);

    if(!isEqual){
        const error = new Error('wrong password')
        error.statusCode = 401
        return next(error);
    }

    const token = jwt.sign({
        id: user._id.toString()
    }, process.env.JWT_SECRET, { /* expiresIn: '24h' */ })

    if(req.body.webPushToken){
        user.webPushToken = JSON.parse(req.body.webPushToken)
        await user.save()
    }

    res.json({'status': 'success', 'data': {
        'token': token,
        'type': user.type,
        'userId': user._id,
        'company': user.company,
    }})

}