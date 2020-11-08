var express = require('express');
var app = express();

var product = require('../public/models/product');
module.exports = function(app){
    // male route
    app.get('/categories', function(req,res,next){
        product.find( {category: 'male'},function(err,products){
            var content = {
                tops: products.map(function(item){
                    if(item.subcategories.includes('Tops')
                    ||item.subcategories.includes('Hoodies')
                    ||item.subcategories.includes('Jackets')
                    ||item.subcategories.includes('Sweatshirts')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.price,
                            color: item.color,
                            image: item.path[1],
                            tags: products.tags,
                        }
                    }
                }),
                // pants & shorts
                pants: products.map(function(item){
                    if(item.subcategories.includes('Shorts')){
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
                    if(item.subcategories.includes('Matching Sets')
                    ||item.subcategories.includes('Outwear')){
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
                        if(item.subcategories.includes('Underwear')
                        || item.subcategories.includes('Socks')) {
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
    // for female
    app.get('/female', function(req,res,next){
        product.find( {category: 'female'},function(err,products){
            var content = {
                 // subcategory classification
                // tops
                tops: products.map(function(item){
                    if(item.subcategories.includes('Tops'||'Crop-tops')
                    ||item.subcategories.includes('Hoddies')
                    ||item.subcategories.includes('Jackets')
                    ||item.subcategories.includes('Sweatshirts')
                    ||item.subcategories.includes('Crop-tops')){
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
                    console.log(item.subcategories)
                    if(item.subcategories.includes('Shorts')||
                    item.subcategories.includes('Skirts')){
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
                    if(item.subcategories.includes('Matching Sets')
                    ||item.subcategories.includes('Outwear')){
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
                        if(item.subcategories.includes('Underwear')
                        ||item.subcategories.includes('Socks')) {
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
                // Dresses
                dresses: products.map(function (item) {
                    if(item.subcategories.includes('Dresses')) {
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
            res.render('categories/female',content)
        });
        
    });
    // children
    app.get('/children', function(req,res,next){
        product.find( {category: 'children'},function(err,products){
            var content = {
                 // subcategory classification
                // tops
                tops: products.map(function(item){
                    if(item.subcategories.includes('Tops'||'Crop-tops')
                    ||item.subcategories.includes('Hoddies')
                    ||item.subcategories.includes('Jackets')
                    ||item.subcategories.includes('Sweatshirts')
                    ||item.subcategories.includes('Crop-tops')){
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
                    console.log(item.subcategories)
                    if(item.subcategories.includes('Shorts')||
                    item.subcategories.includes('Skirts')){
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
                    if(item.subcategories.includes('Matching Sets')
                    ||item.subcategories.includes('Outwear')){
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
                        if(item.subcategories.includes('Underwear')
                        ||item.subcategories.includes('Socks')) {
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
                // Dresses
                dresses: products.map(function (item) {
                    if(item.subcategories.includes('Dresses')) {
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
            res.render('categories/children',content)
        });
        
    });
    // headwear
    app.get('/headwear', function(req,res,next){
        product.find({category: 'headwear'}, function(err,products){
            var content = {
                male: products.map(function(item){
                    if(item.subcategories.includes('Male')){
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
                female: products.map(function(item){
                    if(item.subcategories.includes('Female')){
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
                child: products.map(function(item){
                    if(item.subcategories.includes('Child')){
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
                layout: 'categories'
            }
            res.render('categories/headwear',content)
        })
    })
    // accessories,
    app.get('/accessories', function(req,res,next){
        product.find({category: 'accessories'}, function(err,products){
            var content = {
                male: products.map(function(item){
                    if(item.subcategories.includes('Male')){
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
                female: products.map(function(item){
                    if(item.subcategories.includes('Female')){
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
                child: products.map(function(item){
                    if(item.subcategories.includes('Child')){
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
                layout: 'categories'
            }
            res.render('categories/accessories',content)
        })
    })
    // footwear
    app.get('/footwear', function(req,res,next){
        product.find({category: 'footwear'}, function(err,products){
            var content = {
                male: products.map(function(item){
                    if(item.subcategories.includes('Male')){
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
                female: products.map(function(item){
                    if(item.subcategories.includes('Female')){
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
                child: products.map(function(item){
                    if(item.subcategories.includes('Child')){
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
                layout: 'categories'
            }
            res.render('categories/footwear',content)
        })
    })
 
}