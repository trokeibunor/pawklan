var express = require('express');
var admin = express.Router();
var vhost = require('vhost');
const gallery = require('../public/models/gallery');
const message = require('../public/models/message');
var product = require('../public/models/product');
var staff = require('../public/models/staff');
var user = require('../public/models/user');
var moment = require('moment');
var credentials = require('../public/lib/credentials')
const Crptyr = require('cryptr');
module.exports = function(app){
      app.use(vhost('admin.*',admin));
      app.get('/admin',function(req,res,next){
        res.render('admin/login')
      })
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
      // Show recent customer sign ins
      admin.get('/customers',ensureStaffAuthenticated,function(req,res,next){
        user.find({},function(err,users){
          var content = {
            users : users.map(function(user){
              return{
                id: user.id,
                name: user.name,
                email: user.email
              }
            }),
            user :req.session.username,
            page : 'customers (recent)',
            layout: 'admin'
          }
          res.render('admin/customers', content)
        })
      });
      // product page logic
      admin.get('/product',ensureStaffAuthenticated,(req,res,next)=>{
        product.find({available: true},function(err,products){
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
        staff.find({available: true},function(err,staffs){
          var content = {
              staffs : staffs.map(function(staff){
                  return{
                      id:staff.id,
                      name: staff.name,
                      email: staff.email
                  }
              }),
              layout: 'admin',
              page: 'Compose',
              user: req.session.username,
          }   
          res.render('admin/compose',content)
        })
      })
      // Message Inbox
      admin.get('/inbox',(req,res,next)=>{
        message.find({type: "sentmail", receiver: req.session.username},function(err,messages){
          var content = {
            messages : messages.map(function(message){
              return{
                id: message.id,
                sender: message.sender,
                subject: message.subject,
                time: moment(message.time).fromNow()
              }
            }),
            layout: 'admin',
            page: 'Inbox',
            user: req.session.username,
          }
          res.render('admin/inbox',content)
        })
      })
      // Read mail
      admin.get('/readMail',(req,res,next)=>{
        message.find({_id: req.query.id},function(err,messages){
          var cryptr = new Crptyr(credentials.secretCrypt);
          var content = {
            messages : messages.map(function(message){
              return{
                id: message.id,
                sender: message.sender,
                subject: message.subject,
                time: moment(message.time).fromNow(),
                content: cryptr.decrypt(message.content)
              }
            }),
            layout: 'admin',
            page: 'Read Message',
            user: req.session.username,
          }
          res.render('admin/read',content)
        })
      })
      // Get Drafts
      admin.get('/drafts',(req,res,next)=>{
        message.find({type: "savedDraft", sender: req.session.username},function(err,drafts){
          var content = {
            drafts : drafts.map(function(message){
              return{
                id: message.id,
                subject: message.subject,
                time: moment(message.time).fromNow()
              }
            }),
            layout: 'admin',
            page: 'Draft',
            user: req.session.username,
          }
          res.render('admin/drafts',content)
        })
      })
      // Sent Mails
      admin.get('/sent',(req,res,next)=>{
        message.find({type: "sentmail", sender: req.session.username},function(err,outbox){
          var content = {
            outbox : outbox.map(function(message){
              return{
                id: message.id,
                receiver: message.receiver,
                subject: message.subject,
                time: moment(message.time).fromNow()
              }
            }),
            layout: 'admin',
            page: 'Outbox',
            user: req.session.username,
          }
          res.render('admin/sent',content)
        })
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