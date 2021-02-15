const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, minlength: 6 },
    name: { type: String, required: true },
    phone: { type: String, required: false },
}, { timestamps: true })

module.exports = User = mongoose.model('CustomerUsers', userSchema)