var express = require('express')
const customer = require('../public/models/user');
var bcrypt = require('bcryptjs');
const credentials = require('../public/lib/credentials');
const  submail  = require('../public/models/subscriptionEmail');
// NodeMailer Logic
var nodeMailer = require('nodemailer');
const { text, raw } = require('express');
const customerCareMail = require('../public/models/customerCare');
const products = require('../public/models/product');
var mailTransport = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.password,
    }
});
module.exports = function(app){
    // User authentication
    var passportUI = require('passport') 
    ,LocalStrategy = require('passport-local').Strategy;
    
    // google sign in
    var passportUI = require('passport');
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passportUI.use(new GoogleStrategy({
        clientID: credentials.oauth.clientID,
        clientSecret: credentials.oauth.clientSecret,
        callbackURL: "http://localhost:3000"
    },
    function(accessToken, refreshToken, profile, done) {
        customer.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
    ));
    // local sign in passport middleware
    passportUI.use( 'user-local',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        },
        function(username,password,done){
            customer.getUserByEmail(username, function(err,user){
                if(err){
                    console.log('err from here')
                    console.log(err);
                    return done(err);
                };
                if(!user){
                    console.log('please check username');
                    return done(null, false);
                };
                
                // validate password
                if(bcrypt.compareSync(password,bcrypt.hashSync(password,bcrypt.genSaltSync(10))) == true){
                    return done(null,user);
                }else{
                    console.log(password)
                    console.log('Please Check your Password');
                    return done(null,false);
                };
            });
            
        }
    )
)
    // passport Google User Authentication
    app.get('/auth/google',
    passportUI.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
    app.get('/auth/google/callback', 
    passportUI.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.session.flash = {
            type: 'success',
            intro: 'login Successful',
            message:': '
        }
        res.redirect('/');
    });
    // Sign up Logic
    app.post('/signup',(req,res,next)=>{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        var reqPassword =  hash;
        var pawUser = new Object({
            name : req.body.name,
            email: req.body.email,
            password: reqPassword
        });
        new customer(pawUser).save();
        req.session.flash = {
            type: 'success',
            intro: 'User created ',
            message: ': please Login',
        };
        mailTransport.sendMail({
            from: '"PawKlan Fashion" <pawKlan.com>',
            to: req.body.email,
            subject: "PawKlan user Sign up",
            html: '<h1>Pawklan Fashion</h1>\n<p>Thanks for sign up for Pawklan Fashion the best Fashion store in the Globe ' +
            'PawKlan Fashion. <b>We enjoy your Patronage!</b>',
            generateTextFromHtml: true,
        }, function(error){
        if(error) console.error( 'Unable to send email: ' + error );
        });
        res.redirect('/login');
    });
    // Login Form Handling
    app.post('/login',passportUI.authenticate('user-local',{failureRedirect: '/login',failureFlash:'invalid username or password'}), (req,res)=>{
        console.log(req.user)
        // create user session details
        req.session.username = req.user.name;
        req.session.email = req.body.email;
        req.session.flash = {
            type: 'success',
            intro: 'Login Successful: ',
            message: req.session.username,
        };
        mailTransport.sendMail({
            from: '"PawKlan Fashion" <pawKlan.com>',
            to: req.body.email,
            subject: "PawKlan user Login",
            html: '<h1>Pawklan Fashion</h1>\n<p>Thanks for sign up for Pawklan Fashion the best Fashion store in the Globe ' +
            'PawKlan Fashion. <b>We enjoy your Patronage!</b>',
            generateTextFromHtml: true,
        }, function(error){
        if(error) console.error( 'Unable to send email: ' + error );
        });
        res.redirect('/')
    });
    // subscription mail logic
    app.post('/subEmail',(req,res)=>{
        var pawMail = new Object({
            email: req.body.email
        })
        new submail(pawMail).save();
        // send mail
        mailTransport.sendMail({
            from: '"PawKlan Fashion" <pawKlan.com>',
            to: req.body.email,
            subject: "Subscription to our NewsLetter",
            html: '<h1>Pawklan Fashion</h1>\n<p>Thanks for subscribing to our store Updates ' +
            'PawKlan Fashion. <b>We enjoy your Patronage!</b>',
            generateTextFromHtml: true,
        }, function(error){
        if(error) console.error( 'Unable to send email: ' + error );
        });
        res.redirect('/')
    });
    // forgot password form Handling
    app.post('/forgotPassword', (req,res)=>{
        mailTransport.sendMail({
            from: '"PawKlan Fashion" <pawKlan.com>',
            to: req.body.email,
            subject: "Forgot Password",
            html: '<h1>Pawklan Fashion</h1>\n<p>Thanks for choosing pawklan Fashion ' +
            'Please be patient while we resend you a login link.If the link does not come soon'+
            ', try to login with your mail. <b>Sorry for the inconvinience We enjoy your Patronage!</b>',
            generateTextFromHtml: true,
        }, function(error){
        if(error) console.error( 'Unable to send email: ' + error );
        });
        res.redirect('/')
    })
    // contact form Form Handling
    app.post('/contact',(req,res)=>{
        var pawCustomer = new Object({
            email: req.body.email,
            message: req.body.contact-text,
        })
        new customerCareMail(pawCustomer).save();
        // send mail
        mailTransport.sendMail({
            from: '"PawKlan Fashion" <pawKlan.com>',
            to: req.body.email,
            subject: "Pawklan Customer Service",
            html: '<h1>Pawklan Fashion</h1>\n<p>Thanks for contacting Us ' +
            'PawKlan Fashion would ensure we deal with the issue immediately please be patient. <b>We enjoy your Patronage!</b>',
            generateTextFromHtml: true,
        }, function(error){
        if(error) console.error( 'Unable to send email: ' + error );
        });
        res.redirect('/about')
    });
    // Add product to cart
    app.post('/cart',(req,res)=>{
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;
        products.find({_id: req.query.id},(err,product)=>{
            if(err){
                console.log(err)
            }
            if(cart[req.query.id]){
                cart[req.query.id].qty++;
            }else{
                var required  = {
                    product: product.map(function(item){
                        return{
                            item: item.id,
                            name: item.name,
                            price: item.price,
                            qty: 1,
                        }
                    })
                    
                }
                cart[req.query.id] = required.product[0]; 
            }
            res.redirect('/cart'); 
        })
    })
    // logOut route
    app.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/login')
    })
}