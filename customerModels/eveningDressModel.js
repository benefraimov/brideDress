const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const eveningDressesSchema = new mongoose.Schema({
    image: { type: String, required: true },
    userId: { type: ObjectId, required: true },
}, { timestamps: true })

module.exports = CustomerEveningDress = mongoose.model('CustomerEveningDresses', eveningDressesSchema)