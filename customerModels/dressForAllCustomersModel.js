const mongoose = require('mongoose')

const dressForAllCustomersSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: false },
    price: { type: String, required: false },
    description: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    site: { type: String, required: false },
    email: { type: String, required: false },
    name: { type: String, required: false },
    likeArr: { type: Array, required: false },
    unlikeArr: { type: Array, required: false },
}, { timestamps: true })

module.exports = DressForAllCustomersSchema = mongoose.model('CustomersAllDresses', dressForAllCustomersSchema)