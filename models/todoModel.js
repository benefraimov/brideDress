const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userId: { type: String, required: true },
}, { timestamps: true });

module.exports = Todo = mongoose.model("Todos", todoSchema)