var mongoose = require('mongoose');

var productsSchema = mongoose.Schema({
    name : String,
    slug : String,
    description : String,
    category : String,
    subcategories : [String],
    tags: [String],
    price : Number,
    discount : Number,
    color : [String],
    sku : Number,
    date : String,
    packagesSold : Number,
    featured: String,
    addedBy: String,
    editedBy: String,
    path: String,
})

var products = mongoose.model('products', productsSchema);

module.exports = products;