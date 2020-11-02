var express = require('express');
const gallery = require('../public/models/gallery');
const product =  require('../public/models/product')
module.exports = function(app){
  var router = express.Router()

/* GET home page. */
app.get('/',function(req, res, next) {
  res.render('index');
});
app.get('/shop', function(req,res,next){
  res.render('shop');
});
app.get('/about',(req,res,next)=>{
  res.render('aboutus');
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
app.get('/logout',(req,res,next)=>{
  res.render('logout')
});
app.get('/signup',(req,res,next)=>{
  res.render('signup')
});
app.get('/cart',ensureUserAuthenticated,(req,res,next)=>{
  res.render('cart');
})
app.get('/wishlist',ensureUserAuthenticated,(req,res,next)=>{
  res.render('wishlist');
});
app.get('/forgotPassword',(req,res,next)=>{
  res.render('forgotPasswordUI')
})
app.get('/viewProduct',ensureUserAuthenticated,(req,res,next)=>{
  product.find({id: req.query.id},(err,products)=>{
    var content = {
      products: products.map(function(item){
        return{
          name: item.name,
          desciption: item.description,
          price: item.price,
          color: item.color,
          path: item.path,
        }
      })
    }
    res.render('view-product',content)
  })
  res.render('view-product')
})
function ensureUserAuthenticated(req,res,next){
  if(req.session.username != undefined){
    return next();
  }else{
    res.redirect('/login')
  }
}
}