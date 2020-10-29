var express = require('express')
var customer = require('../public/models/user');
var bcrypt = require('bcryptjs');

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
        clientID: '692249458486-643j5hcss17nih3102b03cfrgami2lre.apps.googleusercontent.com',
        clientSecret: 'ZsdC55S9B2n2DLArqxNxd3ys',
        callbackURL: "http://localhost:3000"
    },
    function(accessToken, refreshToken, profile, done) {
        customer.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
    ));
    // local sign in
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
        }
        res.redirect('/login');
    });
    app.post('/login',passportUI.authenticate('user-local',{failureRedirect: '/login',failureFlash:'invalid username or password'}), (req,res)=>{
        console.log(req.user)
        req.session.username = req.user.name;
        console.log('login successful')
        res.redirect('/')
    });
    // logOut route
    app.get('/logout',(req,res)=>{
        req.logout();
        res.redirect('/login')
    })
}