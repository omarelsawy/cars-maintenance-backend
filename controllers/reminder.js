const Car = require("../models/car");
const Reminder = require("../models/Reminder");
const moment = require('moment');
const { scheduleNotification } = require("../services");
const User = require("../models/user");

exports.all = async (req, res, next) => {
    
    const company = req.company;

    const filter = {'company': company._id};
    const perPage = req.query.perPage ? req.query.perPage : 10
    const page = req.query.page ? req.query.page : 1

    //filter
    if(req.query.carId){
        filter.car = req.query.carId
    }

    //dates
    let startDate = new Date().setUTCHours(0,0,0,0);
    if(req.query.notification === 'true'){
        startDate = new Date();
    }

    if(req.query.reminderDate && 
        moment(req.query.reminderDate).format('YYYY-MM-DD') > moment(startDate).format('YYYY-MM-DD')
    ){
        startDate = new Date(req.query.reminderDate)
    }

    filter.reminderDate = { $gte: startDate }

    if(req.query.reminderDate){
        const toDate = new Date(req.query.reminderDate);
        toDate.setDate(toDate.getDate() + 1);

        filter.reminderDate = { ...filter.reminderDate, 
            $lte: toDate
        }
    }

    const count = await Reminder.find(filter).count()

    const remindersRes = await Reminder.find(filter).sort({reminderDate: -1})
        .populate('car', 'name')
        .populate('creator', 'name')
        .limit(perPage)
        .skip((page-1)*perPage)
        .select('_id description reminderDate');

    res.status(200).json({'status': 'success', 'data': {'reminders': remindersRes, 'count': count}})

}

exports.create = async (req, res, next) => {

    const company = req.company
    let car;

    //car
    if(req.body.carId){
        try{
            car = await Car.findOne({'_id': req.body.carId}).populate('company', '_id')
            if(car?.company._id.toString() !== company._id.toString()){
                return res.status(422).json({'status': 'failed', 'data': {'error': 'car not belong'}});    
            }
        }
        catch(err){
            console.log(err)
            return res.status(500).json({'status': 'failed', 'data': {'error': 'car not found', 'messages': err}})
        }
    }

    const createdReminder = new Reminder();
    createdReminder.company = company._id
    createdReminder.creator = req.userId
    createdReminder.car = car?._id
    createdReminder.description = req.body.description
    createdReminder.reminderDate = new Date(req.body.reminderDate)

    try{
        await createdReminder.save()
    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'data':{'error': err.errors}})
    }

    let users = await User.find({'company': company._id}).select('webPushToken');
    let subscriptions = users.map(user => user.webPushToken)
    let paylaod = JSON.stringify({ 
        title: createdReminder.description
    })
    scheduleNotification(createdReminder.reminderDate, paylaod, subscriptions)

    res.status(201).json({'status': 'success', 'data': {'_id': createdReminder._id}})
}
