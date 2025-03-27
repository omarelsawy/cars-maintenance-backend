const Order = require("../models/order")
const Car = require("../models/car");
const User = require("../models/user");
const { scheduleNotification } = require("../services");
const { getIO } = require('../utils/socket');

exports.all = async (req, res, next) => {
    
    const company = req.company;

    const filter = {'company': company._id};
    const perPage = req.query.perPage ? req.query.perPage : 10
    const page = req.query.page ? req.query.page : 1

    //filter
    if(req.query.carId){
        filter.car = req.query.carId
    }
    if(req.query.employeeId){
        filter.employee = req.query.employeeId
    }

    if(req.query.start){
        filter.$and = [
            { 
                $or: [
                    {start: { $gte: new Date(req.query.start) }},
                    {end: { $gte: new Date(req.query.start) }}
                ]
            },
        ]
    }

    if(req.query.end){
        const date = new Date(req.query.end);
        date.setDate(date.getDate() + 1);

        let secObj = {
            $or: [
                {start: { $lte: date }},
                {end: { $lte: date }}
            ]
        }

        if(filter.$and){
            filter.$and = [...filter.$and,
                secObj
            ]
        }
        else{
            filter.$and = [secObj]
        }

    }

    const count = await Order.find(filter).count()

    const ordersRes = await Order.find(filter).sort({createdAt: -1})
        .populate('car', 'name')
        .populate('creator', 'name')
        .limit(perPage)
        .skip((page-1)*perPage)
        .select('_id start end address status');

    res.status(200).json({'status': 'success', 'data': {'orders': ordersRes, 'count': count}})

}

exports.create = async (req, res, next) => {

    const company = req.company
    let car
    let employee

    try{

        if(req.body.carId){
            car = await Car.findOne({'_id': req.body.carId}).populate('company', '_id')
            if(car?.company._id.toString() !== company._id.toString()){
                return res.status(422).json({'status': 'failed', 'data': {'error': 'car not belong'}});    
            }
        }
        
        if(req.body.employeeId){
            employee = await User.findOne({'_id': req.body.employeeId}).populate('company', '_id')
            if(employee?.company._id.toString() !== company._id.toString()){
                return res.status(422).json({'status': 'failed', 'data': {'error': 'employee not belong'}});    
            }
        }

    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'data': {'error': 'car not found', 'messages': err}})
    }

    const createdOrder = new Order();
    createdOrder.company = company._id
    createdOrder.creator = req.userId
    createdOrder.employee = employee?._id
    createdOrder.car = car?._id
    createdOrder.description = req.body.description
    createdOrder.start = req.body.start
    createdOrder.end = req.body.end
    createdOrder.address = req.body.address
    createdOrder.contact = req.body.contact
    createdOrder.status = 'pending'
    createdOrder.lat = req.body.lat
    createdOrder.long = req.body.long

    try{
        await createdOrder.save()
    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'data':{'error': err.errors}})
    }
    
    let users = await User.find({'company': company._id, '_id': employee?._id}).select('webPushToken');
    let subscriptions = users.map(user => user.webPushToken)
    let paylaod = JSON.stringify({ 
        title: createdOrder.description
    })
    scheduleNotification(createdOrder.start, paylaod, subscriptions)

    const io = getIO();
    io.emit('create_order', {'order': createdOrder})

    res.status(201).json({'status': 'success', 'data': {'_id': createdOrder._id}})
}

exports.show = async (req, res, next) => {

    const company = req.company;

    const id = req.params.id

    const order = await Order.findOne({'_id': id, 'company': company._id})
        .populate('car', 'name')
        .populate('creator', 'name')
        .populate('employee', 'name')
        .select('_id description start end address contact status');

    if(!order){
        return res.status(422).json({'status': 'failed', 'data': {'error': 'not found'}});    
    }

    res.status(200).json({'status': 'success', 'data': {'order': order}})

}
