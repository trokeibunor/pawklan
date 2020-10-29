var express = require('express');
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
  res.render('gallery');
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
function ensureUserAuthenticated(req,res,next){
  if(req.session.username != undefined){
    return next();
  }else{
    res.redirect('/login')
  }
}
}