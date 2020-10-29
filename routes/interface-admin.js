var express = require('express');
var admin = express.Router();
var vhost = require('vhost');
var product = require('../public/models/product');
var staff = require('../public/models/staff');

module.exports = function(app){
      app.use(vhost('admin.*',admin));
      admin.get('/login',(req,res,next)=>{
        res.render('admin/login')
      })
      admin.get('/',ensureStaffAuthenticated,function(req,res,next){
        res.render('admin/home', {layout:'admin',user: req.session.username})
      });
      admin.get('/staff-home',(req,res,next)=>{
        res.render('admin/staff-home',{
          layout:'admin',
          user: req.session.username
        })
      })
      admin.get('/product',ensureStaffAuthenticated,(req,res,next)=>{
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
              user: req.session.username,
          }   
          res.render('admin/product',content)
      })
      })
      admin.get('/staff',ensureStaffAuthenticated ,(req,res,next)=>{
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
              user: req.session.username,
          }   
          res.render('admin/staff',content)
      })
      });
      // gallery
      admin.get('/gallery',(req,res,next)=>{
        res.render('admin/gallery',{layout: 'admin'})
      })
      // forgotpassword
      admin.get('/forgotPassword',(req,res,next)=>{
        res.render('admin/forgotPasswordAdmin')
      })
      // dynamic dashboard routes
      // edit staff
      // edit product
      function ensureStaffAuthenticated(req,res,next){
        if(req.isAuthenticated()){
          return next();
        }else{
          res.redirect('/login')
        }
      }
}