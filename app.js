var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var connect = require("connect");
var vhost = require("vhost");
var favicon = require("serve-favicon");
var admin = express.Router();
var flash = require("connect-flash");

// Mongo models
var product = require("./public/models/product");
// router link

var credentials = require("./public/lib/credentials");

var app = express();

// set port to localhost:3000
// development
app.set("port", process.env.PORT || 3000);

// view engine setup
var handlebars = require("express-handlebars").create({
  defaultLayout: "main",
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
  // static: function(name) {
  //   return require('./lib/static.js').map(name);
  // }
});
// Set up mongo
//link in mongo
var opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  server: {
    socketOptions: { keepAlive: 1 },
  },
};
switch (app.get("env")) {
  case "development":
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    console.log("mongo connected");
    break;
  case "production":
    mongoose.connect(credentials.mongo.production.connectionString, opts);
    break;
  default:
    throw new Error("Unknown execution environment: " + app.get("env"));
}
// Set up sessions storage in mongodb
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
app.use(
  session({
    secret: "pawklan_secret",
    saveUninitialized: true,
    resave: false, //don't save session if unmodified
    store: new MongoStore({
      url: credentials.mongo.production.connectionString,
      ttl: 14 * 24 * 60 * 60,
    }),
  })
);
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
// handlebars Partials setup
app.use(function (req, res, next) {
  if (!res.locals.partials) res.locals.partials = {};
  next();
});

// app.use(logger('dev'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookiesecret));
app.use(require("express-session")());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

// middle ware for flash messages
app.use(function (req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});
//routes
//  Dashboard routes
// app.use(vhost('admin.pawklan.com', require('./routes/interface-admin')));
require("./routes/form-handlerAdmin")(app);
// app.use(vhost('admin.pawklan.com', require('./routes/interface-admin')));
// require("./routes/interface-admin")(app);
app.use(vhost('admin.pawlan.com',admin));
//  User interface routes

require("./routes/form-handlerUI")(app);
require("./routes/interface")(app);
require("./routes/categories")(app);

app.use(function (req, res) {
  res.status("404");
  res.render("404");
});
// custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status("500");
  res.render("500");
});

// run app on localhost
app.listen(app.get("port"), function () {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});

module.exports = app;
