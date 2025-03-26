const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const companyRoutes = require('./routes/company')
const userController = require('./controllers/user');
const { body } = require('express-validator/check');
const isAuth = require ('./middleware/is-auth');
const validateCompany = require('./middleware/validateCompany');
const webPush = require('web-push')
const socketIO = require('./utils/socket');

const app = express();


webPush.setVapidDetails(
    "https://example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

/* const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
} */

app.use(multer({
    storage: fileStorage,
    //fileFilter: fileFilter
}).single('image')
)

app.use('/public/images', express.static(path.join(__dirname, 'public/images')))

app.use(cors());

app.use(bodyParser.json());

//routes
app.post('/users/get-token',
    [
        body('email')
            .isEmail(),
        body('password')
            .notEmpty()
    ], 
    userController.getToken
);

app.use('/company/:slug', [isAuth, validateCompany], companyRoutes);


app.use((err, req, res, next) => {
    console.log(err);

    const status = err.statusCode || 500;

    res.status(status).json({
        'status' : 'faild',
        'data': {'error': err.message, 'errorData': err.data}
    })
    
});

//DB
mongoose.connect(process.env.MONGO_URL_Live)
    .then(result => {
        console.log('connected')
        const server = app.listen(process.env.PORT || 3002);
        socketIO.init(server); // Initialize Socket.IO
    })
    .catch(err => {
        console.log(err);
    });
