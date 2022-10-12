const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        name: {
            type: String,
            required: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        type: {
            type: String
        },
        subType: {
            type: String
        },
        color: {
            type: String
        },
        model: {
            type: String
        },
        numberPlate: {
            type: String
        }
    },
    {timestamps: true} 
);

module.exports = mongoose.model('Car', schema);
