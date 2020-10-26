module.exports = function(app){
/* GET home page. */
app.get('/',function(req, res, next) {
  res.render('index');
});
app.get('/shop', function(req,res,next){
  res.render('shop')
});
app.get('/about',(req,res,next)=>{
  res.render('aboutus')
});
app.get('/gallery',(req,res,next)=>{
  res.render('/gallery')
})
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
app.get('/cart',(req,res,next)=>{
  res.render('cart');
})
app.get('/wishlist',(req,res,next)=>{
  res.render('wishlist');
});
}