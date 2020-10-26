var express = require('express');
var app = express();
var admin = express.Router();
var vhost = require('vhost');
var product = require('../public/models/product');
var staff = require('../public/models/staff');

module.exports = function(app){
      app.use(vhost('admin.*',admin));
      admin.get('/login',(req,res,next)=>{
        res.render('admin/login')
      })
      admin.get('/',ensureAuthenticated,function(req,res,next){
        res.render('admin/home', {layout:'admin',user: req.session.username})
      });
      admin.get('/staff-home',(req,res,next)=>{
        res.render('admin/staff-home',{
          layout:'admin',
          user: req.session.username
        })
      })
      admin.get('/product',ensureAuthenticated,(req,res,next)=>{
        product.find({available: true},function(err,products){
          var content = {
              products : products.map(function(product){
                  return{
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      addedby: product.addedby,
                      editedby: product.editedby,
                      sku: product.sku,
                      date:product.date,
                      packagesSold: product.packagesSold,
                      stockLeft: product.stockLeft
                  }
              }),
              layout: 'admin',
          }   
          res.render('admin/product',content)
      })
      })
      admin.get('/staff',ensureAuthenticated ,(req,res,next)=>{
        staff.find({available: true},function(err,staffs){
          var content = {
              staffs : staffs.map(function(product){
                  return{
                      id:staff.id,
                      name: staff.name,
                      email: staff.email,
                      location: staff.location,
                      accout: staff.accountNum,
                      bank: staff.bank,
                      position: staff.position,
                      salary: staff.salary,
                  }
              }),
              layout: 'admin',
          }   
          res.render('admin/product',content)
      })
      });
      // dynamic dashboard routes
      // edit staff
      // edit product

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/login')
  }
}
}