var mongoose = require('mongoose');

var productsSchema = mongoose.Schema({
    name : String,
    slug : String,
    description : String,
    category : String,
    subcategories : [String],
    price : Number,
    discount : Number,
    color : [String],
    sku : Number,
    date : String,
    packagesSold : Number,
    featured: Boolean,
    addedBy: String,
    editedBy: String,
})

var products = mongoose.model('products', productsSchema);

module.exports = products;