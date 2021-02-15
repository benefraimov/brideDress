const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, minlength: 6 },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    site: { type: String, required: false },
    address: { type: String, required: true },
}, { timestamps: true })

module.exports = User = mongoose.model('DesignerUsers', userSchema)