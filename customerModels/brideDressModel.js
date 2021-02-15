const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const brideDressesSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: false },
    price: { type: String, required: false },
    description: { type: String, required: false },
    location: { type: String, required: false },
    userId: { type: ObjectId, required: true },
}, { timestamps: true })

module.exports = CustomerBrideDress = mongoose.model('CustomerBrideDresses', brideDressesSchema)