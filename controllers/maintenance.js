const Maintenance = require("../models/maintenance")

exports.all = async (req, res, next) => {

    const filter = {};

    //filter
    if(req.query.carId){
        filter.car = req.query.carId
    }

    const maintenanceRes = await Maintenance.find(filter)
        .populate('car', 'name')
        .populate('creator', 'name')
        .select('_id createdAt description price');

    res.status(200).json({'status': 'success', 'data': {'maintenance': maintenanceRes}})

}

exports.show = async (req, res, next) => {

    const id = req.params.id

    const maintenanceRes = await Maintenance.findOne({'_id': id})
        .populate('car', 'name')
        .populate('creator', 'name')
        .select('_id createdAt description price image');

    res.status(200).json({'status': 'success', 'data': {'singleMaintenance': maintenanceRes}})

}

exports.create = async (req, res, next) => {

    const createdMaintenance = new Maintenance();
    createdMaintenance.car = req.body.carId
    createdMaintenance.description = req.body.description
    createdMaintenance.price = req.body.price
    createdMaintenance.creator = req.userId
    createdMaintenance.image = req.file ? req.file.path : undefined;

    try{
        await createdMaintenance.save();
    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'messages': err.errors})
    }

    res.status(201).json({'status': 'success', 'data': {'id': createdMaintenance.id}})

}