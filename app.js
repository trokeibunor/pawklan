var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// router link
var indexRouter = require('./routes/interface');


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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render 404 page not found
  res.status(err.status || 404);
  res.render ('404')
  // render the error page
  res.status(err.status || 500);
  res.render('500');
});

// run app on localhost
app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
  app.get('port') + '; press Ctrl-C to terminate.' );
});

module.exports = app;
