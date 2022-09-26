const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const maintenanceRoutes = require('./routes/maintenance');
const carRoutes = require('./routes/car');
const userRoutes = require('./routes/user');
const cors = require('cors')

const app = express();

app.use(cors());

app.use(bodyParser.json());

//routes
app.use('/maintenance', maintenanceRoutes);
app.use('/cars', carRoutes);
app.use('/users', userRoutes);

app.use((err, req, res, next) => {
    console.log(err);

    const status = err.statusCode || 500;

    res.status(status).json({
        'status' : 'faild',
        'data': {'error': err.message, 'errorData': err.data}
    })
    
});

//DB
mongoose.connect(process.env.MONGO_URL)
    .then(result => {
        console.log('connected');
        app.listen(process.env.SERVER_PORT || 3002);
    })
    .catch(err => {
        console.log(err);
    });
