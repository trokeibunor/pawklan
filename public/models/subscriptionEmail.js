var mongoose = require('mongoose');

var subSchema = mongoose.Schema({
    email: String,
})

var subEmail = mongoose.model('subEmail',subSchema);

module.exports = subEmail