// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
// Mongo models
var product = require('./public/models/product');
// router link

var credentials = require('./public/lib/credentials');


var app = express();

// set port to localhost:3000
app.set('port', process.env.PORT || 3000);

// view engine setup
var handlebars = require('express-handlebars')
.create({defaultLayout: 'main',
helpers: {
  section: function(name, options){
  if(!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null;
  }}
});
          
app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');
// handlebars Partials setup
app.use(function(req, res, next){
  if(!res.locals.partials) res.locals.partials = {};
  next();
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookiesecret));
app.use(require('express-session')());
app.use(express.static(path.join(__dirname, 'public')));
// middle ware for flash messages
app.use(function(req, res, next){
  // if there's a flash message, transfer
  // it to the context, then clear it
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
  });
//link in mongo
var opts = {
  server: {
  socketOptions: { keepAlive: 1 }
  }
  };
  switch(app.get('env')){
    
    case 'development':
    mongoose.connect(credentials.mongo.development.connectionString, opts);
    console.log('mongo connected')
    break;
    case 'production':
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    break;
    default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
  }
  

//routes
require('./routes/interface')(app);

app.use(function(req, res){
  res.status('404');
  res.render('404');
});
  // custom 500 page
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status('500');
  res.render('500');
  });

// run app on localhost
app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
  app.get('port') + '; press Ctrl-C to terminate.' );
});

module.exports = app;
