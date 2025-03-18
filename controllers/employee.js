const User = require("../models/user");
const Order = require("../models/order");

exports.all = async (req, res, next) => {
    
    const company = req.company;

    const filter = {'company': company._id, 'type': 'employee'};

    const count = await User.find(filter).count()

    const employeesRes = await User.find(filter).sort({createdAt: -1})
        .select('_id name');

    res.status(200).json({'status': 'success', 'data': {'employees': employeesRes, 'count': count}})

}

exports.orders = async (req, res, next) => {
    
    const company = req.company;

    const filter = {'company': company._id, 'employee': req.userId};
    const perPage = req.query.perPage ? req.query.perPage : 10
    const page = req.query.page ? req.query.page : 1

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    filter.start = {
        $gte: startOfToday,
        $lt: startOfTomorrow,
    }

    const count = await Order.find(filter).count()

    const ordersRes = await Order.find(filter).sort({createdAt: -1})
        .populate('car', 'name')
        .populate('creator', 'name')
        .limit(perPage)
        .skip((page-1)*perPage)
        .select('_id start end address');

    res.status(200).json({'status': 'success', 'data': {'orders': ordersRes, 'count': count}})

}
