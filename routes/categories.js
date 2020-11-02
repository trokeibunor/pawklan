var express = require('express');
var app = express();

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
    // for female
    app.get('/female', function(req,res,next){
        product.find( {category: 'female'},function(err,products){
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
                    if(product.find({subcategories: {$in : ['Tops'|| 'Hoodies'||'Jackets'||'Sweatshirts'||'Crop-tops']}})){
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
                    if(product.find({subcategories: {$in : ['Shorts'||'Skirts']}})){
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
                    dresses: products.map(function (item) {
                        if(product.find({subcategories: {$in : ['Dresses']}})) {
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
                    if(product.find({subcategories: {$in : ['Tops'|| 'Hoodies'||'Jackets'||'Sweatshirts'||'Crop-tops']}})){
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
                    if(product.find({subcategories: {$in : ['Shorts'||'Skirts']}})){
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
                    dresses: products.map(function (item) {
                        if(product.find({subcategories: {$in : ['Dresses']}})) {
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
    // headwear
    app.get('/headwear', function(req,res,next){
        product.find({category: 'headwear'}, function(err,products){
            var content = {
                male: products.map(function(item){
                    if(product.find({subcategories: {$in : ['Male']}})){
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
                    if(product.find({subcategories: {$in : ['Female']}})){
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
                    if(product.find({subcategories: {$in : ['Child']}})){
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
                    if(product.find({subcategories: {$in : ['Male']}})){
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
                    if(product.find({subcategories: {$in : ['Female']}})){
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
                    if(product.find({subcategories: {$in : ['Child']}})){
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
                    if(product.find({subcategories: {$in : ['Male']}})){
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
                    if(product.find({subcategories: {$in : ['Female']}})){
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
                    if(product.find({subcategories: {$in : ['Child']}})){
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