const mongoose = require('mongoose');

const idSchema = mongoose.Schema({
    number: {
        type: String
    },
    expiration: {
        type: Date
    },
    stateProvince: {
        type: String
    },
    imgPath: {
        type: String
    }
},{ _id : false })

const medRecSchema = mongoose.Schema({
    number: {
        type: String
    },
    issuer: {
        type: String
    },
    expiration: {
        type: Date
    },
    stateProvince: {
        type: String
    },
    imgPath: {
        type: String
    }
},{ _id : false })

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    birthDate: {
        type: Date
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    idInfo: idSchema,
    medRecInfo: medRecSchema
})

var userdata = mongoose.model('userdata', userSchema);

module.exports = userdata;