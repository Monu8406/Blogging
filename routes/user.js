const {Router} = require('express');
const {User,UserSign} = require('../models/user');
const router = Router();

router.get('/signin',(req,res)=>{
  res.render('signin')
})

router.get('/signup',(req,res)=>{
    res.render('signup')
  })

  router.post('/signin',async(req,res)=>{
    
    const {email,password} = req.body;
    try {
      const token =  await User.matchPassword(email,password);
      return res.cookie("token",token).redirect("/")
    } catch (error) {
     return res.render("signin",{
    error:"Incorrect Email or Password"});
    }  
  })
 router.post('/signup',async(req,res)=>{
 const {fullName,email,password} = req.body 
  await User.create({
        fullName,
        email,
        password,
    }).then(()=>{})
    .catch((error)=>{})
  return res.redirect("/")
  })

module.exports =  router ;

router.get('/logout',(req,res)=>{
   res.clearCookie("token").redirect("/")
})
