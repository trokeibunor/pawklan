var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/shop', function(req,res,next){
  res.render('shop')
});
router.get('/categories', function(req,res,next){
  res.render('categories-index',{layout:'shop'})
});
router.get('/about',(req,res,next)=>{
  res.render('aboutus')
})
module.exports = router;
