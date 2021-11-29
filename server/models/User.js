const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String, default: '' },
    surname: { type: String, default: '' },
    sex: { type: String , default: ''},
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, default: '' },
    password: { type: String, required: true },
    activationLink: { type: String },
    isActivated: { type: Boolean, default: false},
})

module.exports = model('User', schema)