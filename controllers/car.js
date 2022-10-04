const Car = require("../models/car");
const Maintenance = require("../models/maintenance");

exports.create = async (req, res, next) => {

    const createdCar = new Car();
    createdCar.name = req.body.name
    createdCar.type = req.body.type
    createdCar.subType = req.body.subType
    createdCar.color = req.body.color
    createdCar.model = req.body.model
    createdCar.numberPlate = req.body.numberPlate

    try{
        await createdCar.save();
    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'messages': err.errors})
    }

    res.status(201).json({'status': 'success', 'data': {'id': createdCar.id}})

}

exports.all = async (req, res, next) => {
    
    let cars = await Car.find().select('_id name');

    res.status(200).json({'status': 'success', 'data': {'cars': cars}})

}

exports.show = async (req, res, next) => {

    const id = req.params.id

    const car = await Car.findOne({'_id': id})
        .select('_id name type subType color model numberPlate').lean();

    let filter = {car: car._id}

    if(req.query.dateFrom){
        filter.createdAt = { $gte: new Date(req.query.dateFrom),
            //$lte: '1987-10-26' 
        }
    }

    if(req.query.dateTo){
        const date = new Date(req.query.dateTo);
        date.setDate(date.getDate() + 1);

        filter.createdAt = { ...filter.createdAt, 
            $lte: date
        }
    }

    const maintenance = await Maintenance.find(filter)
        .select('_id createdAt description price');    

    car.maintenance = maintenance;

    res.status(200).json({'status': 'success', 'data': {'car': car}})

}
