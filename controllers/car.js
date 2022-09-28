const Car = require("../models/car")

exports.create = async (req, res, next) => {

    const createdCar = new Car();
    createdCar.name = req.body.name

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
