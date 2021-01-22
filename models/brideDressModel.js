const mongoose = require('mongoose')

const brideDressesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    cloudinary_id: { type: String },
    userId: { type: String, required: true },
}, { timestamps: true })

module.exports = BrideDress = mongoose.model('BrideDresses', brideDressesSchema)