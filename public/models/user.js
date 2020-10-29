var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
})

var user = mongoose.model('user',userSchema);

module.exports = user;
module.exports.getUserById = function(id,callback){
    user.findById(id,callback);
};
module.exports.getUserByEmail = function(email,callback){
    var query = {email: email};
    user.findOne(query,callback);
};
module.exports.isUser = function(email,callback){
    var query = {email: email};
    return user.findOne(query,callback);
}
