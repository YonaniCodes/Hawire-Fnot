const catchAsync = require('./../utils/catchAsync');
const User= require("../model/userModel")
const jwt= require("jsonwebtoken")
const errorHandler=require("../utils/AppError");
const {promisify}=require("util");
// const sendEmail = require('../utils/mail');
const crypto= require("crypto");
const { Console } = require('console');
const Email= require("../utils/mail")
const signTOKEN = id  => {
   return  jwt.sign({ id:id }, process.env.JWT_SECRET, { expiresIn:process.env.JWT_EXPIRES_IN });
};

const createAndSendToken=(user,res,statusCode)=>{
   const token=signTOKEN(user.id)

   const cookieOptions={
    expires: new Date(
          Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000
    ),
    httpOnly:true
  }

  if(process.env.NODE_ENV==="PRODUCTION")
    cookieOptions.secure=true
  res.cookie("jwt",token,cookieOptions)
 user.password=undefined
  res.status(statusCode).json({
    status: "succes",
    user,
    token
  });

}
exports.signup =catchAsync( async (req, res) => {

  const{name,password,passwordConfirm,email,role}= req.body
  console.log(name,password,passwordConfirm,email,role)
    const newUser= await User.create({name,email,password,passwordConfirm,role})

    const url= `${req.protocol}://${req.get('host')}/me`
    console.log(url)
    await new Email(newUser, url).sendWelcome()

    createAndSendToken(newUser,res,201)

  
  })
exports.login =catchAsync( async (req, res,next) => {
     const{password,email}= req.body
    //  CHECK IF THE USER PROVIDE BOTH PASSWORD AND EMAIL
    if(!email ||!password)
       return next( new errorHandler("Please provide Password and Email",400))
    
    // FIND THE USER ON THE DB
    const user= await User.findOne({email}).select("+password")
    console.log(user)
   
   if (user && await user.correctPassword(password, user.password)) 
      createAndSendToken(user,res,200)
    else
   return next(new errorHandler("Incorrect Password or Email!"));  
})

exports.logout = (req, res) => {
  try {
    res.clearCookie('jwt');
    res.status(200).json({
      status:"success"
    }); 
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Logout failed.'); // Handle the error gracefully
  }
};




exports.protect= catchAsync(async (req,res,next)=>{
 
  let token
// CHECK IF THE HEADER CONTAINS THE AUTHORIZATION TOKEN AND STARTS WITH BEARER AND GET THE TOKEN
  if(req.headers. authorization && req.headers.authorization.startsWith("Bearer"))
     token=req.headers. authorization.split(" ")[1]
   else if(req.cookies)
    token=req.cookies.jwt
  
   else
     return next(new errorHandler("You Are not Logged in",401))

// VERFIY IF THE TOKEN IS NOT MANIPULATED BY THE CLIENT
 const isVerfied= await promisify(jwt.verify)(token,process.env.JWT_SECRET)

 //CHECK IF THE USER IS STILL IN THE DATABASE
 const currentUser= await User.findById(isVerfied.id)
  if(!currentUser){
   return next(new errorHandler("NO such user withis token",401))
  }
// check if the password is changed after the token was issued
if(currentUser.checkPasswordUpdate(isVerfied.iat)
) 
return next(new errorHandler("Password changed a littel ealier, please log in"))

req.user=currentUser
res.locals.user=currentUser

  next()
})

exports.isLogedin=catchAsync( async (req,res,next)=>{

   if(req.cookies.jwt){
    // VERFIY IF THE TOKEN IS NOT MANIPULATED BY THE CLIENT
    const isVerfied= await promisify(jwt.verify)( req.cookies.jwt,process.env.JWT_SECRET)

    //CHECK IF THE USER IS STILL IN THE DATABASE
    const currentUser= await User.findById(isVerfied.id)
     if(!currentUser){
      return next()
     }

   // check if the password is changed after the token was issued
   if(currentUser.checkPasswordUpdate(isVerfied.iat)) 
   return next()

   res.locals.user=currentUser
   next()

  }
   else
     return next()
})


// exports.restrictTo= catchAsync(async (req,res,next,role)=>{
// //  ChECK IF THE USER IS THE ADMIN
//  const {user}=req
//  console.log(user)
// if(!user.role===role)
//   return next( new errorHandler("You are not Alowed",401))
// next()
// })

exports.restrictTo=(...roles)=>{
  return (req,res,next)=>{
    //  ChECK IF THE USER IS AlLOWED
     const {user}=req
     console.log(user.role,roles)
      if(!roles.includes(user.role))  
        return next (new errorHandler("You are not allowed "))
      next()
  
    }
}

exports.forgotPassword= catchAsync(async (req,res,next)=>{
    const {email}= req.body
  // 1 GET THE USER BASED ON HIS EMAIL
      const currentUser= await User.findOne({email})
       if(!currentUser) return next( new errorHandler("There is no such user with this email",401))
  //2 GENERATE THE RANDOM TOKEN
       resetToken= await currentUser.generatePasswordResetToken()
       // this line sets the pre save middleware to false and saves the reset token to DB  
       await currentUser.save({validatebeforSave:false})
  //3 SEND THE EMAIL
    console.log(resetToken)
 

   try {
     
    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    new Email(currentUser,resetURL).sendPasswordResetToken()
     res.status(200).json({
      status:"succes",
      message:"email sent"
  
    })
    
   } catch (error) {
    currentUser.PasswordResetToken=undefined
    currentUser.passwordExpiresIN=undefined
    await currentUser.save({validatebeforSave:false})
      return next(new errorHandler("email not sent try again letter",500))

   }
 
}) 
exports.resetPassword=async (req,res,next)=>{
  // GET THE USER FROM THE TOKEN
  hashedToken=crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest("hex")
  
  const user= await User.findOne({passwordResetToken:hashedToken ,passwordExpiresIN:{$gt:Date.now()}})
  if(!user)
    return next(new errorHandler("The token is invalid or has Expired"))
  user.password=req.body.password
  user.passwordConfirm=req.body.confirmPassword
  
  user.passwordResetToken=undefined
  user.passwordExpiresIN=undefined
  await user.save()


   createAndSendToken(user,res,200)


}


exports.updateMyPassword= catchAsync(async(req,res,next)=>{
    // 1) Get user from collection
   const user = await User.findById(req.user.id).select('+password');
    // 2) Check if Posted current password is correct
   if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
     return next(new errorHandler('Your current password is wrong.', 401));
   }
   console.log(req.body.currentPassword,req.body.passwordConfirm ,req.body.newPassword)
   // 3) If so, update password

   user.password = req.body.newPassword;
   user.passwordConfirm = req.body.passwordConfirm;
   console.log(user.passwordConfirm)
   
   await user.save();

   createAndSendToken(user,res,200)
})