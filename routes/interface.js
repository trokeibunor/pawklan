var express = require('express');
const gallery = require('../public/models/gallery');
const product =  require('../public/models/product');

module.exports = function(app){
  var router = express.Router()
//Get user and parse to all routes
app.get('*',function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.username = req.session.username;
  next();
}) 
/* GET home page. */
app.get('/',function(req, res, next) {
  res.render('index');
});
app.get('/shop', function(req,res,next){
  res.render('shop');
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
app.get('/signup',(req,res,next)=>{
  res.render('signup')
});
app.get('/cart',ensureUserAuthenticated,(req,res,next)=>{
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
  res.render('cart',{
   cart: displayCart,
  });
})
app.get('/wishlist',ensureUserAuthenticated,(req,res,next)=>{
  var wishlist = req.session.wishlist;
  var displayWishlist = {items:[]};
  console.log(wishlist);
  // Get total
  for(var item in wishlist){
    displayWishlist.items.push(wishlist[item]);
  }
  res.render('wishlist',{
   wishlist: displayWishlist,
  });
});
app.get('/forgotPassword',(req,res,next)=>{
  res.render('forgotPasswordUI')
})
app.get('/viewProduct',ensureUserAuthenticated,(req,res,next)=>{
  product.find({_id: req.query.id},(err,products)=>{
    var content = {
      products: products.map(function(product){
        return{
          id: req.query.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          color: product.color,
          path: product.path,
          indexPath : product.path[0]
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
