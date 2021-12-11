const { Schema, model } = require('mongoose')

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String, default: '' },
    surname: { type: String, default: '' },
    sex: { type: String , default: 'male'},
    email: { type: String, unique: true, required: true },
    phone: { type: String,  default: '' },
    image: { type: String, default: 'empty.png' },
    password: { type: String, required: true },
    code: { type: String },
    emailVerified: { type: Boolean, default: false},
    phoneVerified: { type: Boolean, default: false},
})

module.exports = model('User', schema)