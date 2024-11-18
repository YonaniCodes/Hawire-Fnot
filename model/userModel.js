const mongoose = require("mongoose");
const {Schema} = mongoose;
const validator= require("validator")
const bcrypt= require("bcryptjs")
const crypto= require("crypto")

const userSchema = new Schema({
    name: {
        type: String,
        required: [true,"Please Provide your name"],
      },
    email:{
        type: String,
        required: [true,"Please Provide your email"],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail,"Email Not Found"]
        

    },
    photo: {
        type: String,
        default:"default.jpg"
     },
    password:{
        type: String,
        required:[true,"Please provide Password"],
        minlength:8,
        select:false
    },
   passwordConfirm:{
        // required:true,
        type:String,
        validate:{
            message:"Password must match confirm ",
            //  THIS VALIDATION WORK ONLY DURING CREATION OF A USER
            validator: function(val){
                return val===this.password

            }
        },
    },
    role:{  
        type: String,
        enum:{
            values:["user","admin","guide","lead-giude"],
    

        },
        default: "user"

    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    resetTokenExpiresIN: Date,
    active:{
        type:Boolean,
        default:true
             
    }
}, { timestamps: true ,toJSON:{virtuals: true}});
 


userSchema.pre('save', async function (next){
     // runs the password if its only modified
    if(!this.isModified("password"))
        return next()
    // runs the password is encrypted
    this.password= await bcrypt.hash(this.password,12)

    // delete the confirm password
    this.passwordConfirm= undefined
    next()
})
userSchema.pre('save', async function(next){

    if(!this.isModified("password")|| this.isNew)
        return next()
 
    this.passwordChangedAt= Date.now()-1000

})

userSchema.pre(/^find/, function(next){
     this.find({active:{$ne:false}})
   next()
})

 

userSchema.methods.correctPassword = async function(givenPassword,password) {
    return  await bcrypt.compare(givenPassword, password); 
}

userSchema.methods.checkPasswordUpdate=function(jwtTimestamp){
   if(this.passwordChangedAt){
     return  parseFloat(this.passwordChangedAt.getTime())/1000> jwtTimestamp
   }
    return false

}
userSchema.methods.generatePasswordResetToken= async function(){
const resetToken= await  crypto.randomBytes(32).toString("hex")
 this.passwordResetToken= await crypto
     .createHash('sha256')
     .update(resetToken)
     .digest("hex")
 this.resetTokenExpiresIN= Date.now()+ 60*10*1000
  return resetToken
}
  
module.exports = mongoose.model('User',  userSchema);2
//