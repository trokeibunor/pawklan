var express = require('express');
var app = express()

// vhost for dashboard routes

module.exports = function(app){
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
})
}


