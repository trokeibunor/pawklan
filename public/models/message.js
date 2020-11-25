var mongoose  = require('mongoose');

var messageSchema = mongoose.Schema({
    subject: String,
    receiver: String,
    sender: String,
    content: String,
    time: String,
    type: String
})

var message = mongoose.model('message', messageSchema);

module.exports = message;