const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');
    if(authHeader){
        const token = authHeader.split(' ')[1];
        let decodedToken;

        try{
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        }
        catch(err){}
        
        if(decodedToken){
            req.userId = decodedToken.id
            return next();    
        }
    }

    res.status(401).json({'status': 'failed', 'data': {'error': 'not authenticated'}})

}