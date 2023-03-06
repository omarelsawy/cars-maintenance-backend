const mongoose = require('mongoose')

const Schema = mongoose.Schema

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    webPushToken: {
        type: Object,
    },
})

module.exports = mongoose.model('User', schema)