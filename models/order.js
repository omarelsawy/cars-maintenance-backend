const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        description: {
            type: String,
            required: true
        },
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
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        start: {
            type: Date,
        },
        end: {
            type: Date,
        },
        address: {
            type: String,
        },
        contact: {
            type: String,
        },
        lat: {
            type: String,
        },
        long: {
            type: String,
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Order', schema)