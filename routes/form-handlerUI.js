var express = require("express");
const customer = require("../public/models/user");
var bcrypt = require("bcryptjs");
const credentials = require("../public/lib/credentials");
const submail = require("../public/models/subscriptionEmail");
var async = require("async");
// Multer Logic
var multer = require("multer");
var moment = require("moment");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });
// NodeMailer Logic
var nodeMailer = require("nodemailer");
const { text, raw } = require("express");
const customerCareMail = require("../public/models/customerCare");
const products = require("../public/models/product");
var mailTransport = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: credentials.gmail.user,
    pass: credentials.gmail.password,
  },
});
var oxr = require("oxr");
var service = oxr.factory({
  appId: credentials.oxr_auth,
});
module.exports = function (app) {
  // User authentication
  var passportUI = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

  // google sign in
  var passportUI = require("passport");
  var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

  // Use the GoogleStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, an accessToken, refreshToken, and Google
  //   profile), and invoke a callback with a user object.
  passportUI.use(
    new GoogleStrategy(
      {
        clientID: credentials.oauth.clientID,
        clientSecret: credentials.oauth.clientSecret,
        callbackURL: "https://pawklan.herokuapp.com",
        passReqToCallback: true,
      },
      function (accessToken, refreshToken, profile, done) {
        customer.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    )
  );
  // local sign in passport middleware
  passportUI.use(
    "user-local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (username, password, done) {
        customer.getUserByEmail(username, function (err, user) {
          if (err) {
            console.log("err from here");
            console.log(err);
            return done(err);
          }
          if (!user) {
            console.log("please check username");
            return done(null, false);
          }

          // validate password
          if (
            bcrypt.compareSync(
              password,
              bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            ) == true
          ) {
            return done(null, user);
          } else {
            console.log(password);
            console.log("Please Check your Password");
            return done(null, false);
          }
        });
      }
    )
  );
  // passport Google User Authentication
  app.get(
    "/auth/google",
    passportUI.authenticate("google", {
      scope: ["email","profile"],
    })
  );
  app.get(
    "/auth/google/callback",
    passportUI.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      res.session.flash = {
        type: "success",
        intro: "login Successful",
        message: ": ",
      };
      res.redirect("/");
    }
  );
  // Sign up Logic
  app.post("/signup", (req, res, next) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var reqPassword = hash;
    var pawUser = new Object({
      name: req.body.name,
      email: req.body.email,
      password: reqPassword,
    });
    new customer(pawUser).save();
    req.session.flash = {
      type: "success",
      intro: "User created ",
      message: ": please Login",
    };
    mailTransport.sendMail(
      {
        from: '"PawKlan Fashion" <pawKlan.com>',
        to: req.body.email,
        subject: "PawKlan user Sign up",
        html:
          "<h1>Pawklan Fashion</h1>\n<p>Thanks for sign up for Pawklan Fashion the best Fashion store in the Globe " +
          "PawKlan Fashion. <b>We enjoy your Patronage!</b>",
        generateTextFromHtml: true,
      },
      function (error) {
        if (error) console.error("Unable to send email: " + error);
      }
    );
    res.redirect("/login");
  });
  // Login Form Handling
  app.post(
    "/login",
    passportUI.authenticate("user-local", {
      failureRedirect: "/login",
      failureFlash: "invalid username or password",
    }),
    (req, res) => {
      console.log(req.user);
      // create user session details
      req.session.username = req.user.name;
      req.session.user = req.user;
      req.session.email = req.body.email;
      req.session.flash = {
        type: "success",
        intro: "Login Successful: ",
        message: req.session.username,
      };
      mailTransport.sendMail(
        {
          from: '"PawKlan Fashion" <pawKlan.com>',
          to: req.body.email,
          subject: "PawKlan user Login",
          html:
            "<h1>Pawklan Fashion</h1>\n<p>Thanks for sign up for Pawklan Fashion the best Fashion store in the Globe " +
            "PawKlan Fashion. <b>We enjoy your Patronage!</b>",
          generateTextFromHtml: true,
        },
        function (error) {
          if (error) console.error("Unable to send email: " + error);
        }
      );
      res.redirect("/");
    }
  );

  // subscription mail logic
  app.post("/subEmail", (req, res) => {
    var pawMail = new Object({
      email: req.body.email,
    });
    new submail(pawMail).save();
    // send mail
    mailTransport.sendMail(
      {
        from: '"PawKlan Fashion" <pawKlan.com>',
        to: req.body.email,
        subject: "Subscription to our NewsLetter",
        html:
          "<h1>Pawklan Fashion</h1>\n<p>Thanks for subscribing to our store Updates " +
          "PawKlan Fashion. <b>We enjoy your Patronage!</b>",
        generateTextFromHtml: true,
      },
      function (error) {
        if (error) console.error("Unable to send email: " + error);
      }
    );
    res.redirect("/");
  });
  // forgot password form Handling
  app.post("/forgotPassword", (req, res) => {
    mailTransport.sendMail(
      {
        from: '"PawKlan Fashion" <pawKlan.com>',
        to: req.body.email,
        subject: "Forgot Password",
        html:
          "<h1>Pawklan Fashion</h1>\n<p>Thanks for choosing pawklan Fashion " +
          "Please be patient while we resend you a login link.If the link does not come soon" +
          ", try to login with your mail. <b>Sorry for the inconvinience We enjoy your Patronage!</b>",
        generateTextFromHtml: true,
      },
      function (error) {
        if (error) console.error("Unable to send email: " + error);
      }
    );
    res.redirect("/");
  });
  // contact form Form Handling
  app.post("/contact", (req, res) => {
    console.log(req.body.contactMail);
    console.log(req.body.contactText);
    var pawCustomer = new Object({
      email: req.body.contactMail,
      message: req.body.contactText,
    });
    console.log(pawCustomer);
    new customerCareMail(pawCustomer).save();
    // send mail
    mailTransport.sendMail(
      {
        from: '"PawKlan Fashion" <pawKlan.com>',
        to: req.body.email,
        subject: "Pawklan Customer Service",
        html:
          "<h1>Pawklan Fashion</h1>\n<p>Thanks for contacting Us " +
          "PawKlan Fashion would ensure we deal with the issue immediately please be patient. <b>We enjoy your Patronage!</b>",
        generateTextFromHtml: true,
      },
      function (error) {
        if (error) console.error("Unable to send email: " + error);
      }
    );
    res.redirect("/about");
  });
  // Get Currency
  app.post("/getCurrency", upload.none(), (req, res) => {
    var countryCode = req.body.countryCode;
    req.session.currency = countryCode;
    console.log(req.session.currency);
    res.redirect("back");
  });
  // Add product to cart
  app.post("/cart", (req, res, next) => {
    var factorPost;
    service = oxr.cache(
      {
        method: "latest",
        ttl: 7 * 24 * 1000 * 3600,
        store: {
          get: function () {
            return Promise.resolve(this.value);
          },
          put: function (value) {
            this.value = value;
            return Promise.resolve(this.value);
          },
        },
      },
      service
    );
    req.session.cart = req.session.cart || {};
    var cart = req.session.cart;
    var currency = req.session.currency || "USD";
    var itemID =
      "." + req.query.id + req.body.color_option + req.body.size_option + ".";
    var local = {};
    async.series([
      function () {
        service.latest().then(async function (result) {
          var rates = result.rates;
          if (currency in rates) {
            factorPost = await rates[currency];
            products.find({ _id: req.query.id }, (err, product) => {
              if (err) {
                console.log(err);
              }
              if (cart[itemID]) {
                cart[itemID].qty++;
              } else {
                var required = {
                  product: product.map(function (item) {
                    return {
                      picture: item.path[0],
                      item: item.id,
                      hidden: itemID,
                      name: item.name,
                      slug: item.slug,
                      price: item.getDisplayPrice(factorPost),
                      colour: req.body.color_option,
                      size: req.body.size_option,
                      qty: 1,
                      currency: currency,
                      delete: "X",
                    };
                  }),
                };
                console.log(required.product[0]);
                cart[itemID] = required.product[0];
              }
              req.session.flash = {
                type: "secondary",
                intro: "Product added to cart",
                message:
                  '<a href="/cart" style="font-weight: bold;">View cart</a>',
              };
              res.redirect("back");
            });
          } else {
            products.find({ _id: req.query.id }, (err, product) => {
              if (err) {
                console.log(err);
              }
              if (cart[itemID]) {
                cart[itemID].qty++;
              } else {
                var required = {
                  product: product.map(function (item) {
                    return {
                      picture: item.path[0],
                      item: item.id,
                      hidden: itemID,
                      name: item.name,
                      slug: item.slug,
                      price: item.getDisplayPrice(1),
                      colour: req.body.color_option,
                      size: req.body.size_option,
                      qty: 1,
                      currency: currency,
                      delete: "X",
                    };
                  }),
                };
                console.log(required.product[0]);
                cart[itemID] = required.product[0];
              }
              req.session.flash = {
                type: "secondary",
                intro: "Product added to cart",
                message:
                  '<a href="/cart" style="font-weight: bold;">View cart</a>',
              };
              res.redirect("back");
            });
          }
        });
      },
    ]);
  });
  // Remove Item from cart
  app.get("/removeItem", (req, res) => {
    var stuff = req.query.id;
    delete req.session.cart[stuff];
    res.redirect("/cart");
  });
  // Add Product to wishlist
  app.post("/wishlist", (req, res) => {
    var factorWish;
    req.session.wishlist = req.session.wishlist || {};
    var currency = req.session.currency || "USD";
    var wishlist = req.session.wishlist;
    service = oxr.cache({
        method: 'latest',
        ttl: 7 * 24 * 1000 * 3600,
        store: {
          get: function () {
            return Promise.resolve(this.value)
          },
          put: function (value) {
            this.value = value
            return Promise.resolve(this.value)
          }
        }
    }, service)
    async.series([
        function(){
            service.latest().then(
                async function(result){
                    var rates = results.rates;
                    if(currency in rates){
                        factorWish = await rates[currency];
                        products.find({ _id: req.query.id }, (err, product) => {
                            if (err) {
                              console.log(err);
                            }
                            if (wishlist[req.query.id]) {
                              wishlist[req.query.id];
                            } else {
                              var required = {
                                product: product.map(function (item) {
                                  return {
                                    picture: item.path[0],
                                    slug: item.slug,
                                    item: item.id,
                                    name: item.name,
                                    price: item.getDisplayPrice(factorWish),
                                    currency: currency,
                                    delete: "X",
                                  };
                                }),
                              };
                              wishlist[req.query.id] = required.product[0];
                            }
                            req.session.flash = {
                              type: "info",
                              intro: "Product added to ",
                              message: '<a href="/wishlist" style="font-weight: bold;">Wishlist</a>',
                            };
                            res.redirect("back");
                          });
                    }else{
                        products.find({ _id: req.query.id }, (err, product) => {
                            if (err) {
                              console.log(err);
                            }
                            if (wishlist[req.query.id]) {
                              wishlist[req.query.id];
                            } else {
                              var required = {
                                product: product.map(function (item) {
                                  return {
                                    picture: item.path[0],
                                    slug: item.slug,
                                    item: item.id,
                                    name: item.name,
                                    price: item.getDisplayPrice(1),
                                    currency: currency,
                                    delete: "X",
                                  };
                                }),
                              };
                              wishlist[req.query.id] = required.product[0];
                            }
                            req.session.flash = {
                              type: "info",
                              intro: "Product added to ",
                              message: '<a href="/wishlist" style="font-weight: bold;">Wishlist</a>',
                            };
                            res.redirect("back");
                          });
                    }
                }
            )
        }
    ])
  });
  // Remove Item from wishlist
  app.get("/removeGoods", (req, res) => {
    var stuff = req.query.id;
    delete req.session.wishlist[stuff];
    res.redirect("/wishlist");
  });
  // logOut route
  app.get("/logout", (req, res) => {
    req.session.user = null;
    req.session.username = null;
    req.session.email = null;
    req.logout();
    res.redirect("/login");
  });
};
