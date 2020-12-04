const gallery = require('../public/models/gallery');
const product =  require('../public/models/product');
var async = require('async');
const products = require('../public/models/product');
var credentials  = require('../public/lib/credentials')
// currency conversion
var oxr = require('oxr')
var service = oxr.factory({
  appId: credentials.oxr_auth
 });
//  Support for caching
// service = oxr.cache({
// method: 'latest',
// ttl: 7 * 24 * 1000 * 3600,
// store: {
//   get: function () {
//     return Promise.resolve(this.value)
//   },
//   put: function (value) {
//     this.value = value
//     return Promise.resolve(this.value)
//   }
// }
// }, service)
//  service.latest().then(function(result){
//   var rates = result.rates
//   // console.log(JSON.stringify(rates))
// })
module.exports = function(app){
  //Get user and parse to all routes
app.get('*',function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.username = req.session.username;
  res.locals.currency = req.session.currency || 'USD';
  res.locals.email = req.session.email;
  // res.locals.conFactor = req.session.conFactor;
  next();
})
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
  var factor;
  service = oxr.cache({
    method: 'latest',
    ttl: 7 * 24 * 1000 * 3600,
    store: {
      get: function () {
        return Promise.resolve(this.value)
      },
      put: function (value) {
        this.value = value
        return Promise.resolve(this.value)
      }
    }
    }, service)
    
  var local = {};
  async.series([
    // Function for getting featured products
    function(callback){
      service.latest().then(
        async function(result){
        var currency = req.session.currency|| 'USD';
        var rates = result.rates;
        if(currency in rates){
          factor = await rates[currency];
          console.log(factor)
          product.find({featured: true},function(err,features){
            local.features = features.map(
              function(item){
              return {
                  id: item.id,
                  name:item.name,
                  sku: item.sku,
                  description:item.description,
                  discount: item.discount || 'Zero',
                  price: item.getDisplayPrice(factor),
                  color: item.color,
                  image: item.path[0],
                  tags: products.tags,
                  currency: req.session.currency || 'USD'
              }
            });
            callback()
          })
        }else{
          product.find({featured: true},function(err,features){
            local.features = features.map(
              function(item){
              console.log(factor)
              return {
                  id: item.id,
                  name:item.name,
                  sku: item.sku,
                  description:item.description,
                  discount: item.discount || 'Zero',
                  price: item.getDisplayPrice(1),
                  color: item.color,
                  image: item.path[0],
                  tags: products.tags,
                  currency: req.session.currency || 'USD'
              }
            });
            callback()
          })
        }
        local.rate = rates;
      }).catch(function(err){
        console.log(err)
        return null
    });
    },
    // new arraivals far male
    function(callback){
      service.latest().then(
        async function(result){
        var currency = req.session.currency|| 'USD';
        var rates = result.rates;
        if(currency in rates){
          factor = await rates[currency];
          console.log(factor)
          product.find({category: "male"},function(err,newMale){
          if(err) callback(err);
          local.newMale = newMale.map(function(item){
            return {
              id: item.id,
              name:item.name,
              sku: item.sku,
              description:item.description,
              discount: item.discount || 'Zero',
              price: item.getDisplayPrice( factor),
              color: item.color,
              image: item.path[0],
              tags: products.tags,
              currency: req.session.currency || 'USD'
            }
          });
          callback()
        }).sort({date:-1}).limit(3);
        
      }else{
        product.find({category: "male"},function(err,newMale){
          if(err) callback(err);
          local.newMale = newMale.map(function(item){
            return {
              id: item.id,
              name:item.name,
              sku: item.sku,
              description:item.description,
              discount: item.discount || 'Zero',
              price: item.getDisplayPrice(1),
              color: item.color,
              image: item.path[0],
              tags: products.tags,
              currency: req.session.currency || 'USD'
            }
          });
          callback()
        }).sort({date:-1}).limit(3);
      }
      }).catch(function(err){
        console.log(err)
      })
    },
    // new arriavals for female category
    function(callback){
      service.latest().then(
        async function(result){
        var currency = req.session.currency|| 'USD';
        var rates = result.rates;
        if(currency in rates){
          factor = await rates[currency];
          console.log(factor)
          product.find({category: "female"},function(err,newFemale){
          if(err) callback(err);
          local.newFemale = newFemale.map(function(item){
            return {
              id: item.id,
              name:item.name,
              sku: item.sku,
              description:item.description,
              discount: item.discount || 'Zero',
              price: item.getDisplayPrice( factor),
              color: item.color,
              image: item.path[0],
              tags: products.tags,
              currency: req.session.currency || 'USD'
            }
          });
          callback()
        }).sort({date:-1}).limit(3);
        
      }else{
        product.find({category: "female"},function(err,newFemale){
          if(err) callback(err);
          local.newFemale = newFemale.map(function(item){
            return {
              id: item.id,
              name:item.name,
              sku: item.sku,
              description:item.description,
              discount: item.discount || 'Zero',
              price: item.getDisplayPrice(1),
              color: item.color,
              image: item.path[0],
              tags: products.tags,
              currency: req.session.currency || 'USD'
            }
          });
          callback()
        }).sort({date:-1}).limit(3);
        
      }
      }).catch(function(err){
        console.log(err)
      })
    }
  ],function(err){
    res.render('shop',{featured: local.features,
    male : local.newMale, 
    female : local.newFemale,
    money: req.session.currency || 'USD',
    })
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
// search
app.get('/xhr/search',function(req,res,next){
  // regex search
  var q = req.query.q;
  product.find({
    name: {
      $regex: new RegExp(q)
    }
  },{
    __v:0
  },function(err,data){
    console.log(data)
    res.json(data)
  }).limit(5)
})
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
app.get('/wishlist',ensureUserAuthenticated,(req,res,next)=>{
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
