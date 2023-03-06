const Car = require("../models/car");
const Maintenance = require("../models/maintenance");

exports.create = async (req, res, next) => {

    const company = req.company;

    const createdCar = new Car();
    createdCar.name = req.body.name
    createdCar.type = req.body.type
    createdCar.subType = req.body.subType
    createdCar.color = req.body.color
    createdCar.model = req.body.model
    createdCar.numberPlate = req.body.numberPlate
    createdCar.company = company._id

    try{
        await createdCar.save();
    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'messages': err.errors})
    }

    res.status(201).json({'status': 'success', 'data': {'_id': createdCar._id}})

}

exports.all = async (req, res, next) => {
    
    const company = req.company;
    const perPage = req.query.perPage ? req.query.perPage : 50
    const page = req.query.page ? req.query.page : 1

    let carsCount = await Car.find({'company': company._id}).count();

    let cars = await Car.find({'company': company._id})
        .limit(perPage)
        .skip((page-1)*perPage)
        .sort({createdAt: -1})
        .select('_id name');

    let carsResPromise = cars.map(async (car) => {

        let maintenanceCount = await Maintenance.find({car: car._id}).count();

        return {
            '_id': car._id,
            'name': car.name,
            'maintenanceCount': maintenanceCount,
        }
    })

    const carsRes = await Promise.all(carsResPromise)

    res.status(200).json({'status': 'success', 'data': {'cars': carsRes, 'count': carsCount}})

}

exports.show = async (req, res, next) => {

    const company = req.company;

    const id = req.params.id

    const car = await Car.findOne({'_id': id, 'company': company._id})
        .select('_id name type subType color model numberPlate').lean();

    if(!car){
        return res.status(422).json({'status': 'failed', 'data': {'error': 'not found'}});    
    }

    const perPage = req.query.perPage ? req.query.perPage : 10
    const page = req.query.page ? req.query.page : 1

    let filter = {car: car._id}

    if(req.query.dateFrom){
        filter.maintenanceDate = { $gte: new Date(req.query.dateFrom),
            //$lte: '1987-10-26' 
        }
    }

    if(req.query.dateTo){
        const date = new Date(req.query.dateTo);
        date.setDate(date.getDate() + 1);

        filter.maintenanceDate = { ...filter.maintenanceDate, 
            $lte: date
        }
    }

    const maintenanceCount = await Maintenance.find(filter).count();

    const maintenance = await Maintenance.find(filter)
        .limit(perPage)
        .skip((page-1)*perPage)
        .select('_id maintenanceDate description price');    

    car.maintenance = maintenance;

    res.status(200).json({'status': 'success', 'data': {'car': car, 'maintenanceCount': maintenanceCount}})

}
