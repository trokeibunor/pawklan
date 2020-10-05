var express = require('express');
var app = express();
var admin = express.Router();
var vhost = require('vhost');


// vhost for dashboard routes

module.exports = function(app){
  app.use(vhost('admin.*',admin));
/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index');
});
app.get('/shop', function(req,res,next){
  res.render('shop')
});
app.get('/categories', function(req,res,next){
  res.render('categories-index',{layout:'categories'})
});
app.get('/about',(req,res,next)=>{
  res.render('aboutus')
});
// dashboard routes
admin.get('/',function(req,res,next){
  res.render('admin/home', {layout:'admin'})
});
admin.get('/product', (req,res,next)=>{
  res.render('admin/product', {
    layout : 'admin',
  })
})
admin.get('/staff', (req,res,next)=>{
  res.render('admin/staff',{layout: 'admin'})
})
}


