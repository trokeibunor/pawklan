var express = require('express');
var app = express();
var admin = express.Router();
var vhost = require('vhost');
app.use(vhost('admin.*',admin));
// dashboard routes
admin.get('/',function(req,res,next){
  res.render('admin/home', {layout:'admin'})
})

module.exports = admin;