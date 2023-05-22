const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    content:{type:String},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "user"}
}, {timestamps: true})

const todo = mongoose.model("todo", todoSchema)
module.exports = todo