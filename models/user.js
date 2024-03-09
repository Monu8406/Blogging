const {Schema,model} = require('mongoose');
const {createHmac,randomBytes} = require('crypto');
const { createTokenUser } = require('../routes/services/authentication');

const userSchema  = new Schema({
   fullName:{
    type:String,
   
   },
   email:{
    type:String,
    required:true,
    unique:true,
   },
  salt:{
    type:String,
     },
  password:{
    type:String,
    required:true,
    },

    profileImageURL:{
        type:String,
        default:'/images/default.png',
        required:true,
    },
   role: {
    type:String,
    enum:["USER","ADMIN"],
    default:"USER",

    }
},
{timestamps:true}
)


const UserSchema = new Schema({
    
    email:{
     type:String,
     required:true,
     unique:true,
    },
   password:{
     type:String,
     required:true,
     },

 },
 {timestamps:true}
 )
 const salt = "monukumar"
 userSchema.pre("save",function(next){
    const user = this;
   if(!user.isModified('password'))return ;
   
   const hashedPassword = createHmac('sha256', salt)
   .update(user.password)
   .digest('hex');
   this.salt = salt ;
   
   this.password = hashedPassword
   next()
 })

  userSchema.static('matchPassword',async function(email,password){
    const user = await this.findOne({email});
     if(!user)  {   
         throw new Error('User not found');
       }  
     const hashedPassword = user.password;   
     const userProvideHash = createHmac("sha256",salt).update(password).digest("hex");
     if(userProvideHash === hashedPassword ){ 
     const token =  createTokenUser(user)
     return token;
    }
    else{
      
      throw new Error("User not Found");
    }
 
  })
 const User = model('user',userSchema);
 const UserSign = model('usersignin',UserSchema);
 module.exports = {User,UserSign};

 
