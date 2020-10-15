var mongoose = require('mongoose');
var bcrypt =  require('bcryptjs');

const { model } = require('./product');
var flash = require('connect-flash');
var staffSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    location: String,
    accountNum: Number,
    bank: String,
    position: String,
    salary: Number,
    phone: Number,
});

var staff = mongoose.model('staff', staffSchema);
module.exports = staff;
module.exports.getStaffById = function(id,callback){
    staff.findById(id,callback);
};
module.exports.getStaffByEmail = function(email,callback){
    var query = {email: email};
    staff.findOne(query,callback);
};

