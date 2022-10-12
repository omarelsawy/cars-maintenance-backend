const Company = require("../models/company");
const User = require("../models/user");

module.exports = async (req, res, next) => {

    const slug = req.params.slug

    const user = await User.findOne({'_id': req.userId}).populate('company', '_id')
    
    const company = await Company.findOne({'slug': slug, 'active': true})

    if(!company){
        return res.status(401).json({'status': 'failed', 'data': {'error': 'company not valid request'}});    
    }

    if(company._id.toString() !== user.company._id.toString()){
        return res.status(401).json({'status': 'failed', 'data': {'error': 'company not belong request'}});    
    }

    req.company = company
    req.user = user

    return next();    

}