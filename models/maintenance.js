const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        description: {
            type: Schema.Types.String,
            required: true
        },
        maintenanceDate: {
            type: Date,
            required: true
        },
        price: {
            type: Schema.Types.Number
        },
        image: {
            type: String
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {timestamps: true} 
);

module.exports = mongoose.model('Maintenance', schema);
