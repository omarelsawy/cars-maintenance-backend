const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            unique: true
        },
        active: {
            type: Boolean
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
        },
        phone: {
            type: String,
        },
    },
    {timestamps: true} 
);

module.exports = mongoose.model('Company', schema);
