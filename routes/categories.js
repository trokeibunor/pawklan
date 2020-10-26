var express = require('express');
var app = express();
// var admin = express.Router();
// var vhost = require('vhost');
var product = require('../public/models/product');
module.exports = function(app){
    // male route
    app.get('/categories', function(req,res,next){
        product.find( {category: 'male'},function(err,products){
            var content = {
                products: products.map(function(product){
                        return {
                            id: product.id,
                            name:product.name,
                            sku: product.sku,
                            description:product.description,
                            price: product.price,
                            color: product.color,
                            image: product.path[0],
                            tags: product.tags,
                            subcategories: product.subcategories,
                        }
                    }
                ),
                // subcategory classification
                // tops
                tops: products.map(function(item){
                    if(product.find({subcategories: {$in : ['Tops'|| 'Hoodies'||'Jackets'||'Sweatshirts']}})){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.price,
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                        }
                    }
                }),
                // pants & shorts
                pants: products.map(function(item){
                    if(product.find({subcategories: {$in : ['Shorts']}})){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.price,
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                        }
                    }
                }),
                // // outwear & matching Sets
                outwear: products.map(function(item){
                    if(product.find({subcategories: {$in : ['Matching Sets'||'Outwear']}})){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.price,
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                        }
                    }
                }),
                // // Socks and Underwear
                underwear: products.map(function (item) {
                        if(product.find({subcategories: {$in : ['Underwear'||'Socks']}})) {
                            return {
                                id: item.id,
                                name: item.name,
                                sku: item.sku,
                                description: item.description,
                                discount: item.discount || 'Zero',
                                price: item.price,
                                color: item.color,
                                image: item.path[0],
                                tags: item.tags,
                            };
                        }
                    }),
                layout: 'categories',
                
            };
            res.render('categories/categories_male',content)
        });
        
    });
    // for female,children

    // accessories, headwear
}