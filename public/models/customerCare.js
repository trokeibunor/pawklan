var mongoose = require('mongoose');

var customerCare = mongoose.Schema({
    email: String,
    message: String,
})

var customerCareMail = mongoose.model('care',customerCare);

module.exports = customerCareMail