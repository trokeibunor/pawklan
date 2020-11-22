var express = require('express');
var multer = require('multer');
var moment = require('moment');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/images/')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    },
     
});
var upload = multer({ storage: storage });
var vhost = require('vhost');
var product = require('../public/models/product');
var staff = require('../public/models/staff');
var gallery = require('../public/models/gallery');
var now = moment();
// User authentication
var passport = require('passport') 
    ,LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
const customer = require('../public/models/user');
function sort(val){
    if (val != undefined)
    return val;
}

module.exports = function (app){
    var admin  = express.Router();
    app.use(vhost('admin.*',admin));
    passport.serializeUser(function(user,done){
        if (staff.isStaff(user.email)){
            done(null,user.id)
        }else if(customer.isUser(user.email)){
            done(null, user.id)
        }
    });
    passport.deserializeUser(function(id,done){
        staff.getStaffById(id, function(err,staff){
            done(err,staff)
        })
    });
    passport.use('staff-local',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        },
        function(username,password,done){
            staff.getStaffByEmail(username, function(err,staff){
                if(err){
                    console.log(err);
                    return done(err);
                };
                if(!staff){
                    console.log('please check username');
                    return done(null, false);
                };
                
                // validate password
                if(bcrypt.compareSync(password,bcrypt.hashSync(password,bcrypt.genSaltSync(10))) == true){
                    return done(null,staff);
                }else{
                    console.log(password)
                    console.log('error from here');
                    return done(null,false);
                };
                // test staff login
            });

        }
    )
)
    // Forms
    // handle login form
    function reqPath(path){
        if(path == undefined){
            return null
        }else{
            return  path.split('\\').slice(1).join('\\')
        }
    };
    admin.post('/login',passport.authenticate('staff-local',{failureRedirect: '/login',failureFlash:'invalid username or password'}), (req,res)=>{
        staff.getStaffPost(req.body.email, function(err,staff){
            if(err){
                console.log(err);
                throw err
            }
            console.log(staff.position);
            if(staff.position === 'admin'|| staff.position === 'supervisor'){
                req.session.admin = staff.position;
                req.session.username = staff.name;
                console.log(req.session.username);
                req.session.flash = {
                    type: 'success',
                    intro: 'Login Successful',
                    message: ':  ' + req.session.username,
                }
                res.redirect('/')
            }else{
                console.log('from else statement')
                req.session.username = staff.name;
                console.log(req.session.username);
                req.session.flash = {
                    type: 'success',
                    intro: 'Login Successful',
                    message: ':  ' + req.session.username,
                }
                res.redirect('/')
            }
        })
    });
    admin.get('/logout',(req,res)=>{
        req.session.admin = null;
        req.session.username = null;
        console.log(req.user)
        req.logout();
        res.redirect('/login')
    })
    // handle add Product form
    admin.post('/process-product',upload.array('productImages', 5),function(req,res,next){
        // console.log(req.file.path);
        var file = req.files
        var path = [reqPath(file[0].path),reqPath(file[1].path),reqPath(file[2].path),
        reqPath(file[3].path),reqPath(file[4].path)];
        console.log(path);
        var color_array = req.body.productColour;
        var subCategories_array = [req.body.SC_hoodies,req.body.SC_tops,req.body.SC_outwear,
            req.body.SC_shorts,req.body.SC_jackets,req.body.SC_sweatshirts,
            req.body.SC_underwear,req.body.SC_socks,req.body.SC_matching,
            req.body.SC_skirts,req.body.SC_dresses,req.body.SC_male,req.body.SC_female,req.body.SC_child].filter(sort); 
        var tags_array = [req.body.t_hoodies,req.body.t_tops,req.body.t_outwear,
            req.body.t_shorts,req.body.t_jackets,req.body.t_sweatshirts,
            req.body.t_underwear,req.body.t_socks,req.body.t_matching,
            req.body.t_skirts,req.body.t_dresses].filter(sort);
        var pawProduct = new Object({
            name: req.body.productName,
            slug: req.body.productSlug,
            size: req.body.productSize,
            sku:  req.body.productQuantity,
            price: req.body.productPrice,
            discount: req.body.productDiscount,
            color: color_array,
            category: req.body.productCategory,
            subcategories: subCategories_array,
            tags: tags_array,
            description: req.body.productDescription,
            addedBy: req.session.username, 
            featured: req.body.productFeatured,
            path: path,
            date: now,
        });
        try {
            new product(pawProduct).save();
            console.log(pawProduct);
            req.session.flash = {
                type:'success',
                intro: 'Request success',
                message: 'Product Added',
            };
        } catch (error) {
            req.session.flash = {
                type:'danger',
                intro: 'Request Failure',
                message: 'Check variables and try again',
            };
            console.log(error);
        } finally{
            res.redirect(303,'/product');
        }
        
    });
    // edit product form
    admin.post('/process-edit-product',upload.single('product_image'),function(req,res,next){
        // var path = req.file.path;
        // const reqPath = path.split('\\').slice(1).join('\\');
        var categories_array = [req.body.c_male,req.body.c_women,req.body.c_children,req.body.c_furniture,req.body.c_sports,req.body.c_utilities,req.body.c_gadgets,req.body.c_mobile].filter(sort); 
        var tags_array = [req.body.t_male,req.body.t_women,req.body.t_children,req.body.t_furniture,req.body.t_sports,req.body.t_utilities,req.body.t_gadgets,req.body.t_mobile].filter(sort);
        var UIproduct = new Object({
            name: req.body.name,
            slug: req.body.slug,
            size: req.body.size,
            sku:  req.body.sku,
            price: req.body.price,
            color: req.body.color,
            category: categories_array,
            tags: tags_array,
            description: req.body.description,
            available: true,
            // path: reqPath,
        });
        product.updateOne({_id: req.query.product}, UIproduct,(err)=>{
            if(err){
                console.log(err)
                req.session.flash = {
                    type: 'danger',
                    intro: 'validation failure',
                    message: 'Product NOT updated'
                }
            }else{
                req.session.flash = {
                    type:'success',
                    intro: 'Validation success',
                    message: 'Product Updated',
                };
                res.redirect(303,'/product');
            }
        });
    });
    // Add staff form
    admin.post('/process-staff',upload.single('staffImage'),(req,res,next)=>{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.staffPassword, salt);
        var reqPassword =  hash
        var pawStaff = new Object({
            name: req.body.staffName,
            email: req.body.staffEmail,
            location: req.body.staffLocation,
            password: reqPassword,
            accountNum: req.body.staffAccount,
            bank: req.body.staffBank,
            phone: req.body.staffPhone,
            salary: req.body.staffSalary,
            position: req.body.staffPosition,
        })
        try {
            new staff(pawStaff).save();
            console.log(pawStaff);
            console.log(staff)
            req.session.flash = {
                type:'success',
                intro: 'Request success',
                message: 'staff Employed',
            };
        } catch (error) {
            req.session.flash = {
                type:'danger',
                intro: 'Request Failure',
                message: 'Check variables and try again',
            };
            console.log(error);
        } finally{
            res.redirect(303,'/staff');
        }
    }) 
    // gallery upload
    admin.post('/galleryUpload',upload.single('galleryImage'),(req,res,next)=>{
        console.log(req.file)
        var pawGallery = new Object({
            title : req.body.galleryTitle,
            description: req.body.galleryDesc,
            path: reqPath(req.file.path),
            available: true,
            addedBy: req.session.username
        });
        
        try {
            new gallery(pawGallery).save();
            console.log(pawGallery);
            req.session.flash = {
                type:'success',
                intro: 'Request success',
                message: 'Product Added',
            };
        } catch (error) {
            req.session.flash = {
                type:'danger',
                intro: 'Request Failure',
                message: 'Please Check variables and try again',
            };
            console.log(error);
        } finally{
            res.redirect(303,'/gallery');
        }

    })
};