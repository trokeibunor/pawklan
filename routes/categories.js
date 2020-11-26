var express = require('express');
var product = require('../public/models/product');
module.exports = function(app){
    // male route
    app. get('/categories', function(req,res,next){
        var content = {
            layout: 'categories', 
        };
        res.render('categories/categories_male',content)
    });
    // Male Tops
    app.get('/categories/tops',function(req,res,next){
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
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[1],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/male-category/tops',content)
        });
    });
    // Male Pants
    app.get('/categories/pants',function(req,res,next){
        product.find( {category: 'male'},function(err,products){
            var content = {
                pants: products.map(function(item){
                    if(item.subcategories.includes('Shorts')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/male-category/pants',content)
        });
    });
    // Male matching Sets and outwear
    app.get('/categories/matchingSet',function(req,res,next){
        product.find( {category: 'male'},function(err,products){
            var content = {
                outwear: products.map(function(item){
                    if(item.subcategories.includes('Matching Sets')
                    ||item.subcategories.includes('Outwear')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/male-category/matchingSet',content)
    });
});
    // Male underwear and socks
    app.get('/categories/underwear',function(req,res,next){
        product.find( {category: 'male'},function(err,products){
            var content = {
                underwear: products.map(function (item) {
                    if(item.subcategories.includes('Underwear')
                    || item.subcategories.includes('Socks')) {
                        return {
                            id: item.id,
                            name: item.name,
                            sku: item.sku,
                            description: item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        };
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/male-category/underwear',content)
        });
    });
    
    //Female categories Routes 
    // for female
    app.get('/female', function(req,res,next){
        var content = {
            layout: 'categories' 
        };
        res.render('categories/female',content)  
    });
    // female tops
    app.get('/female/tops',function(req,res,next){
        product.find( {category: 'female'},function(err,products){
            var content = {
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
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/female-category/tops',content)
    });
});
    // Female shorts
    app.get('/female/shorts',function(req,res,next){
        product.find( {category: 'female'},function(err,products){
            var content = {
                shorts: products.map(function(item){
                    if(item.subcategories.includes('Shorts')||
                    item.subcategories.includes('Skirts')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/female-category/shorts',content)
        });
    });
    // Female Dresses
    app.get('/female/dresses',function(req,res,next){
        product.find( {category: 'female'},function(err,products){
            var content = {
                // Dresses
                dresses: products.map(function (item) {
                    if(item.subcategories.includes('Dresses')) {
                        return {
                            id: item.id,
                            name: item.name,
                            sku: item.sku,
                            description: item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        };
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/female-category/dresses',content)
        });
    });
    // Female outwear & matching sets
    app.get('/female/outwear',function(req,res,next){
        product.find( {category: 'female'},function(err,products){
            var content = {
                // Dresses
                outwear: products.map(function(item){
                    if(item.subcategories.includes('Matching Sets')
                    ||item.subcategories.includes('Outwear')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/female-category/outwear',content)
        });
    });
    // Female underwear
    app.get('/female/underwear',function(req,res,next){
        product.find( {category: 'female'},function(err,products){
            var content = {
                // UnderWear
                underwear: products.map(function (item) {
                    if(item.subcategories.includes('Underwear')
                    ||item.subcategories.includes('Socks')) {
                        return {
                            id: item.id,
                            name: item.name,
                            sku: item.sku,
                            description: item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        };
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/female-category/underwear',content)
        });
    }) 

    // Children categories Routes
    // children
    app.get('/children', function(req,res,next){
        var content = {
            layout: 'categories',
        };
        res.render('categories/children',content);
    });
    // children Tops
    app.get('/children/tops',function(req,res,next){
        product.find( {category: 'children'},function(err,products){
            var content = {
                tops: products.map(function(item){
                    if(item.subcategories.includes('Tops')
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
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/children-category/tops',content)
        });
    });
    // Children Pant & shorts & skirts
    app.get('/children/shorts',function(req,res,next){
        product.find( {category: 'children'},function(err,products){
            var content = {
                shorts: products.map(function(item){
                    if(item.subcategories.includes('Shorts')||
                    item.subcategories.includes('Skirts')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/children-category/shorts',content)
        });
    });
    // Children Outwears & matching Sets
    app.get('/children/outwear',function(req,res,next){
        product.find( {category: 'children'},function(err,products){
            var content = {
                outwear: products.map(function(item){
                    if(item.subcategories.includes('Matching Sets')
                    ||item.subcategories.includes('Outwear')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/children-category/outwear',content)
        });
    });
    // Children Underwear
    app.get('/children/underwear',function(req,res,next){
        product.find( {category: 'children'},function(err,products){
            var content = {
                underwear: products.map(function (item) {
                    if(item.subcategories.includes('Underwear')
                    ||item.subcategories.includes('Socks')) {
                        return {
                            id: item.id,
                            name: item.name,
                            sku: item.sku,
                            description: item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        };
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/children-category/underwear',content)
        });
    });
    // Children Dresses
    app.get('/children/dresses',function(req,res,next){
        product.find( {category: 'children'},function(err,products){
            var content = {
                dresses: products.map(function (item) {
                    if(item.subcategories.includes('Dresses')) {
                        return {
                            id: item.id,
                            name: item.name,
                            sku: item.sku,
                            description: item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: item.tags,
                            currency: req.session.currency
                        };
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/children-category/dresses',content)
        });
    });
    
    // HeadWear Category Routes
    // headwear
    app.get('/headwear', function(req,res,next){
        var content = {
            
            layout: 'categories'
        }
        res.render('categories/headwear',content)
    })
    // Headwear Male
    app.get('/headwear/male',function(req,res,next){
        product.find( {category: 'headwear'},function(err,products){
            var content = {
                male: products.map(function(item){
                    if(item.subcategories.includes('Male')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/headwear-category/male',content)
    });
});
    // Headwear Female 
    app.get('/headwear/female',function(req,res,next){
    product.find( {category: 'headwear'},function(err,products){
        var content = {
            female: products.map(function(item){
                if(item.subcategories.includes('Female')){
                    return {
                        id: item.id,
                        name:item.name,
                        sku: item.sku,
                        description:item.description,
                        discount: item.discount || 'Zero',
                        price: item.getDisplayPrice(),
                        color: item.color,
                        image: item.path[0],
                        tags: products.tags,
                        currency: req.session.currency
                    }
                }
            }),
            layout: 'categories'
        }
        res.render('categories/headwear-category/female',content)
});
});
    // Headwear Children
    app.get('/headwear/children',function(req,res,next){
        product.find( {category: 'headwear'},function(err,products){
            var content = {
                child: products.map(function(item){
                    if(item.subcategories.includes('Child')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/headwear-category/children',content)
    });
    });
           
    // Accessories Category Routes
    // Accessories
    app.get('/accessories', function(req,res,next){
        var content = {
            
            layout: 'categories'
        }
        res.render('categories/accessories',content)
    })
    // Accessories Male
    app.get('/accessories/male',function(req,res,next){
        product.find( {category: 'accessories'},function(err,products){
            var content = {
                male: products.map(function(item){
                    if(item.subcategories.includes('Male')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/accessories-category/male',content)
    });
});
    // Accessories Female 
    app.get('/accessories/female',function(req,res,next){
    product.find( {category: 'accessories'},function(err,products){
        var content = {
            female: products.map(function(item){
                if(item.subcategories.includes('Female')){
                    return {
                        id: item.id,
                        name:item.name,
                        sku: item.sku,
                        description:item.description,
                        discount: item.discount || 'Zero',
                        price: item.getDisplayPrice(),
                        color: item.color,
                        image: item.path[0],
                        tags: products.tags,
                        currency: req.session.currency
                    }
                }
            }),
            layout: 'categories'
        }
        res.render('categories/accessories-category/female',content)
});
});
    // Accessories Children
    app.get('/accessories/children',function(req,res,next){
        product.find( {category: 'accessories'},function(err,products){
            var content = {
                child: products.map(function(item){
                    if(item.subcategories.includes('Child')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/accessories-category/children',content)
    });
    });
    
    // Footwear Category Routes
    // Accessories
    app.get('/footwear', function(req,res,next){
        var content = {
            
            layout: 'categories'
        }
        res.render('categories/footwear',content)
    })
    // Footwear Male
    app.get('/footwear/male',function(req,res,next){
        product.find( {category: 'footwear'},function(err,products){
            var content = {
                male: products.map(function(item){
                    if(item.subcategories.includes('Male')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/footwear-category/male',content)
    });
});
    // Footwear Female 
    app.get('/footwear/female',function(req,res,next){
    product.find( {category: 'accessories'},function(err,products){
        var content = {
            female: products.map(function(item){
                if(item.subcategories.includes('Female')){
                    return {
                        id: item.id,
                        name:item.name,
                        sku: item.sku,
                        description:item.description,
                        discount: item.discount || 'Zero',
                        price: item.getDisplayPrice(),
                        color: item.color,
                        image: item.path[0],
                        tags: products.tags,
                        currency: req.session.currency
                    }
                }
            }),
            layout: 'categories'
        }
        res.render('categories/footwear-category/female',content)
});
});
    // Accessories Children
    app.get('/footwear/children',function(req,res,next){
        product.find( {category: 'footwear'},function(err,products){
            var content = {
                child: products.map(function(item){
                    if(item.subcategories.includes('Child')){
                        return {
                            id: item.id,
                            name:item.name,
                            sku: item.sku,
                            description:item.description,
                            discount: item.discount || 'Zero',
                            price: item.getDisplayPrice(),
                            color: item.color,
                            image: item.path[0],
                            tags: products.tags,
                            currency: req.session.currency
                        }
                    }
                }),
                layout: 'categories'
            }
            res.render('categories/footwear-category/children',content)
    });
    });   
}