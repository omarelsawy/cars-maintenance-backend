const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        description: {
            type: Schema.Types.String,
            required: true
        },
        reminderDate: {
            type: Date,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        car: {
            type: Schema.Types.ObjectId,
            ref: 'Car',
        }
    },
    {timestamps: true} 
);

module.exports = mongoose.model('Reminder', schema);
