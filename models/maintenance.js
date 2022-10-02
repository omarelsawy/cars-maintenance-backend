const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: true
        },
        description: {
            type: Schema.Types.String
        },
        price: {
            type: Schema.Types.Number
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
