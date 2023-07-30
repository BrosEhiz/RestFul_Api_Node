const mongoose = require('mongoose');
const Schema = mongoose.Schema

const orderSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ 
        type: String,
        required: true,
        max: 20},
    unit:{
        type: Number,
        required: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema )