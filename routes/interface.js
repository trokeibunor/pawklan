var express = require('express');
const gallery = require('../public/models/gallery');
const product =  require('../public/models/product');
var async = require('async');
const products = require('../public/models/product');
var credentials  = require('../public/lib/credentials')
// currency conversion
var oxr = require('open-exchange-rates');
var fx = require('money');
oxr.set({ app_id: credentials.oxr_auth })

module.exports = function(app){
  //Get user and parse to all routes
app.get('*',function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.username = req.session.username;
  res.locals.currency = req.session.currency || 'USD';
  res.locals.email = req.session.email;
  next();
})
// Get currency
app.post('/getCurrency',(req,res, next)=>{
  req.body.countryCode = req.session.currency;
  console.log(req.body.countryCode);
  res.redirect('/')
});
/* GET home page. */
app.get('/',function(req, res, next) {
  gallery.find({available: true},function(err, photos){
    var content = {
      photos: photos.map(function(image){
        return {
          id: image.id,
          path: image.path,
        }
      }),
    }
    res.render('index',content)
  })
});
// Shop Page
app.get('/shop', function(req,res,next){
  // var currency = req.session.currency;
  // oxr.latest(function(err) {
  //   // Apply exchange rates and base rate to `fx` library object:
  //   fx.rates = oxr.rates;
  //   fx.base = oxr.base;
  //   if(err){
  //     console.log(err)
  //   }
  //   // money.js is ready to use:
  //   console.log(Math.ceil(fx(1).from('USD').to(currency)));
  // });
  var local = {};
  async.parallel([
    function(callback){
      product.find({featured: true},function(err,features){
        local.features = features.map(function(item){
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
              currency: req.session.currency || 'USD'
          }
        });
        callback()
      })
    },
    // new arraivals far male
    function(callback){
      product.find({category: "male"},function(err,newMale){
        if(err) callback(err);
        local.newMale = newMale.map(function(item){
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
            currency: req.session.currency || 'USD'
        }
        });
        callback()
      }).sort({date:-1}).limit(3);
    },
    // new arriavals for female category
    function(callback){
      product.find({category: "female"},function(err,newFemale){
        if(err) callback(err);
        local.newFemale = newFemale.map(function(item){
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
            currency: req.session.currency || 'USD'
        }
        });
        callback()
      }).sort({date:-1}).limit(3);
    }
  ],function(err){
    res.render('shop',{featured: local.features, male : local.newMale, female : local.newFemale})
  })
});
app.get('/about',(req,res,next)=>{
  res.render('aboutus', {email: req.session.email});
});
app.get('/gallery',(req,res,next)=>{
  gallery.find({available: true},function(err, photos){
    var content = {
      photos: photos.map(function(image){
        return {
          id: image.id,
          path: image.path,
          title: image.title,
          description: image.description,
        }
      }),
    }
    res.render('gallery',content)
  })
});
// the use of passport
app.get('/login',(req,res,next)=>{
  res.render('login')
});
app.get('/terms',(req,res,next)=>{
  res.render('terms')
});
app.get('/thanks',(req,res,next)=>{
  res.render('thanks')
});
app.get('/checkout',(req,res,next)=>{
  // get cart from sessions
  var cart = req.session.cart;
  var displayCart = {items:[],total:0};
  var total = 0;
  // Get total
  for(var item in cart){
    displayCart.items.push(cart[item]);
    total += cart[item].qty * cart[item].price;
  }
  displayCart.total = total;
  res.render('checkout',{
   cart: displayCart,
  });
})
app.get('/signup',(req,res,next)=>{
  res.render('signup')
});
app.get('/cart',(req,res,next)=>{
  // get cart from sessions
  var cart = req.session.cart;
  var displayCart = {items:[],total:0,currency: req.session.currency || 'USD'};
  var total = 0;
  // Get total
  for(var item in cart){
    displayCart.items.push(cart[item]);
    total += cart[item].qty * cart[item].price;
  }
  displayCart.total = total;
  res.render('cart',{
   cart: displayCart,
  });
})
// Empty cart
app.get('/emptyCart',(req,res)=>{
  delete req.session.cart;
  res.redirect('/cart');
})

// Wishlist
app.get('/wishlist',(req,res,next)=>{
  var wishlist = req.session.wishlist;
  var displayWishlist = {items:[]};
  // Get total
  for(var item in wishlist){
    displayWishlist.items.push(wishlist[item]);
  }
  res.render('wishlist',{
   wishlist: displayWishlist,
  });
});
// Delete WishList
app.get('/emptyWishList',(req,res)=>{
  delete req.session.wishlist;
  res.redirect('/wishlist');
})
app.get('/forgotPassword',(req,res,next)=>{
  res.render('forgotPasswordUI')
})
app.get('/viewProduct',(req,res,next)=>{
  product.find({_id: req.query.id},(err,products)=>{
    var content = {
      products: products.map(function(product){
        return{
          id: req.query.id,
          name: product.name,
          slug: product.slug,
          description: product.description ,
          price: product.getDisplayPrice(),
          color: product.color,
          path: product.path,
          indexPath : product.path[0],
          currency : req.session.currency
        }
      })
    }
    res.render('view-product',content)
  })
});

function ensureUserAuthenticated(req,res,next){
  if(req.session.username != undefined){
    return next();
  }else{
    res.redirect('/login')
  }
}
}
