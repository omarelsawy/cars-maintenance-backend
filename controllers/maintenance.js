const Maintenance = require("../models/maintenance")

exports.all = async (req, res, next) => {

    const filter = {};

    //filter
    if(req.query.carId){
        filter.car = req.query.carId
    }

    const maintenanceRes = await Maintenance.find(filter)
        .populate('car', 'name')
        .select('_id createdAt');

    res.status(200).json({'status': 'success', 'data': {'maintenance': maintenanceRes}})

}

exports.create = async (req, res, next) => {

    const createdMaintenance = new Maintenance();
    createdMaintenance.car = req.body.carId

    try{
        await createdMaintenance.save();
    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'messages': err.errors})
    }

    res.status(201).json({'status': 'success', 'data': {'id': createdMaintenance.id}})

}