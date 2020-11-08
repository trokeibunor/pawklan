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
    stockLeft: Number,
    featured: String,
    addedBy: String,
    editedBy: String,
    path: [String],
    available: Boolean,
    rating: [String],
    comments: [String]
})

var products = mongoose.model('products', productsSchema);
// write functions for stock left

// write funtions for most orders

// write functions for new orders


module.exports = products;