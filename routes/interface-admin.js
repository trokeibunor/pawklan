var express = require('express');
var admin = express.Router();
var vhost = require('vhost');
const gallery = require('../public/models/gallery');
var product = require('../public/models/product');
var staff = require('../public/models/staff');

module.exports = function(app){
      app.use(vhost('admin.*',admin));
      admin.get('*',function(req,res,next){
        res.locals.admin = req.session.admin;
        res.locals.user = req.session.username;
        next();
      })
      admin.get('/login',(req,res,next)=>{
        res.render('admin/login')
      })
      admin.get('/',ensureStaffAuthenticated,function(req,res,next){
        res.render('admin/home', {
          layout:'admin',
          user: req.session.username,
          page: 'Home',
        })
      });
      admin.get('/product',ensureStaffAuthenticated,(req,res,next)=>{
        product.find({available: true},function(err,products){
          console.log(products);
          var content = {
              products : products.map(function(product){
                  return{
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      addedby: product.addedBy,
                      editedby: product.editedby,
                      sku: product.sku,
                      date:product.date,
                      packagesSold: product.packagesSold,
                      stockLeft: product.stockLeft
                  }
              }),
              layout: 'admin',
              page: 'Product',
              user: req.session.username,
          }   
          res.render('admin/product',content)
      })
      })
      admin.get('/staff',ensureStaffAuthenticated ,(req,res,next)=>{
        staff.find({available: true},function(err,staffs){
          var content = {
              staffs : staffs.map(function(staff){
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
              page: 'Staff',
              user: req.session.username,
          }   
          res.render('admin/staff',content)
        })
      });
      // gallery
      admin.get('/gallery',ensureStaffAuthenticated,(req,res,next)=>{
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
            layout: 'admin',
            page: 'Gallery',
            user: req.session.username,
          }
          res.render('admin/gallery',content)
        })
      })
      // Message Routes
      // Compose Mail
      admin.get('/compose',(req,res,next)=>{
        res.render('admin/compose',{layout:'admin'})
      })
      // Message Inbox
      admin.get('/inbox',(req,res,next)=>{
        res.render('admin/inbox',{layout: 'admin'})
      })
      // Read mail
      admin.get('/readMail',(req,res,next)=>{
        res.render('admin/read',{layout: 'admin'})
      })
      // Get Drafts
      admin.get('/drafts',(req,res,next)=>{
        res.render('admin/drafts',{layout: 'admin'})
      })
      // Sent Mails
      admin.get('/sent',(req,res,next)=>{
        res.render('admin/sent',{layout: 'admin'})
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