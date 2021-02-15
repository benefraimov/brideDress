const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: ObjectId, required: true },
}, { timestamps: true });

module.exports = Todo = mongoose.model("Todos", todoSchema)