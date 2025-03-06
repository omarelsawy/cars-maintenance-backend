const Maintenance = require("../models/maintenance");
const Car = require("../models/car");

exports.all = async (req, res, next) => {
    
    const company = req.company;

    const filter = {'company': company._id};
    const perPage = req.query.perPage ? req.query.perPage : 10
    const page = req.query.page ? req.query.page : 1

    //filter
    if(req.query.carId){
        filter.car = req.query.carId
    }

    const count = await Maintenance.find(filter).count()

    const maintenanceRes = await Maintenance.find(filter).sort({maintenanceDate: -1})
        .populate('car', 'name')
        .populate('creator', 'name')
        .limit(perPage)
        .skip((page-1)*perPage)
        .select('_id maintenanceDate description price');

    res.status(200).json({'status': 'success', 'data': {'maintenance': maintenanceRes, 'count': count}})

}

exports.show = async (req, res, next) => {

    const company = req.company;

    const id = req.params.id

    const maintenanceRes = await Maintenance.findOne({'_id': id, 'company': company._id})
        .populate('car', 'name')
        .populate('creator', 'name')
        .select('_id maintenanceDate description price image');

    if(!maintenanceRes){
        return res.status(422).json({'status': 'failed', 'data': {'error': 'not found'}});    
    }

    res.status(200).json({'status': 'success', 'data': {'singleMaintenance': maintenanceRes}})

}

exports.create = async (req, res, next) => {

    const company = req.company;

    const car = await Car.findOne({'_id': req.body.carId}).populate('company', '_id')
    if(car?.company._id.toString() !== company._id.toString()){
        return res.status(422).json({'status': 'failed', 'data': {'error': 'car not belong'}});    
    }

    const createdMaintenance = new Maintenance();
    createdMaintenance.car = req.body.carId
    createdMaintenance.description = req.body.description
    createdMaintenance.price = req.body.price ? parseInt(convertArabicToWesternNumber(req.body.price)) : ''
    createdMaintenance.creator = req.userId
    createdMaintenance.company = company._id
    createdMaintenance.maintenanceDate = req.body.maintenanceDate
    createdMaintenance.image = req.file ? req.file.path : undefined;

    try{
        await createdMaintenance.save();
    }
    catch(err){
        console.log(err)
        return res.status(500).json({'status': 'failed', 'data':{'error': err.errors}})
    }

    res.status(201).json({'status': 'success', 'data': {'_id': createdMaintenance._id}})

}

const convertArabicToWesternNumber = (arabicNum) => {
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩"; // Arabic numerals (0-9)
    const westernDigits = "0123456789"; // Western numerals (0-9)
  
    return arabicNum
      .split("")
      .map(char => {
        let index = arabicDigits.indexOf(char);
        return index !== -1 ? westernDigits[index] : char;
      })
      .join("");
  }