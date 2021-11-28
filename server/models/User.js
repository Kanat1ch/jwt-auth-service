const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    activationLink: { type: String },
    isActivated: { type: Boolean, default: false},
})

module.exports = model('User', schema)