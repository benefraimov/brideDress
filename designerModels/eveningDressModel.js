const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const eveningDressesSchema = new mongoose.Schema({
    image: { type: String, required: true },
    cloudinary_id: { type: String },
    userId: { type: ObjectId, required: true },
}, { timestamps: true })

module.exports = DesignerEveningDress = mongoose.model('DesignerEveningDresses', eveningDressesSchema)