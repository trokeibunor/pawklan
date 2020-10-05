var mongoose = require('mongoose');
const { model } = require('./product');

var staffSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    location: String,
    position: String,
    salary: Number,
    phone: Number
})

var staff = mongoose.model('staff', staffSchema);

module.exports = staff; 