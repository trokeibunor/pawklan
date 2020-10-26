var mongoose = require('mongoose');
var bcrypt =  require('bcryptjs');

const { model } = require('./product');

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
    messages: [String],
    availble: Boolean

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
module.exports.getStaffPost = function(email,callback){
    var query = {email: email};
    staff.findOne(query,callback);
};


