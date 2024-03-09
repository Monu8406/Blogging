
const express = require("express");
const cookieParser = require('cookie-parser');
const path = require('path');
const app =  express();
const Blog =  require('./models/blog');
const userRoute =require('./routes/user');
const blogRoute =require('./routes/blog');
const mongoose = require('mongoose');
require('dotenv').config(); 
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));  
   mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
         
        }).catch((error)=>{
        
        });            
        app.use(express.static("./public"));  
        
const PORT = process.env.PORT|| 8000;  

app.set('view engine','ejs')   
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({extended: false }));
app.use(express.static(path.resolve('./public')));

app.get('/',async(req,res)=>{
        const allBlogs = await Blog.find({});
        console.log(allBlogs);
        res.render('home',{
        user:req.user,
        blogs:allBlogs
 });
});
                        
app.use('/user',userRoute);
app.use('/blog',blogRoute);
app.listen(PORT,()=>{});





