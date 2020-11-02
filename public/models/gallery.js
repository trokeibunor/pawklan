var mongoose = require('mongoose');

var gallerySchema = mongoose.Schema({
    path: String,
    title: String,
    description: String,
    available: Boolean,
    addedBy: String
})

var gallery = mongoose.model('gallery', gallerySchema)

module.exports = gallery;