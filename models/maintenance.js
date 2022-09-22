const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
            required: true
        }
    },
    {timestamps: true} 
);

module.exports = mongoose.model('Maintenance', schema);
