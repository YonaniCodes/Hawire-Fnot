const errorHandler= require("../utils/AppError")

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new errorHandler(message, 400);
  };
  
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
  
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new errorHandler(message, 400);
  };
  
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new errorHandler(message, 400);
  };

const sendDevError=(error,req,res)=>{
    const  status= error.status|| 'error'
    const statusCode=error.statusCode||500
    const message=error.message
    const ErrorStackTrace=error.stack

    //  API Error handling
     if(req.originalUrl.startsWith("/api"))
        res.status(statusCode).json({
            status,
            message,
            ErrorStackTrace,
            error
        })
    else{
		// For Rendered Website
        res.status(statusCode).render('error',{
            title:"Something went Very Wrong!",
            msg: error.message
         })
         
    }
       
 
}
const sendProdError=(error,req,res)=>{
    const  status= error.status|| 'error'
    const statusCode=error.statusCode||500
    const message=error.message


		 //  API Error handling
     if(req.originalUrl.startsWith("/api")){
					if(error.isOperational){
						res.status(statusCode).json({
								status,
								message
						})
					}
				else{
						console.log("💥 ERROR",error)
						res.status(500).json({
								status:"ERROR",
								message:"Something went Very Wrong!"
					})
					}
		 }
		//  Errror Handling For rendered websites
		 else{
					if(error.isOperational){
						res.status(statusCode).render('error',{
							title:"Something went Very Wrong!",
							msg: error.message
						})
					}
					else{
						console.log("💥 ERROR",error)
						res.status(statusCode).render('error',{
							title:"Something went Very Wrong!",
							msg:"Please Try Again"
						})
					}

		 }


  
}
const handleJWTError=err=> console.log("handling")

module.exports = (error, req, res, next) => {
    const env = process.env.NODE_ENV.trim();
     if (env === "DEVELOPMENT") {
         sendDevError(error,req,res);
    } else if (env === "PRODUCTION") {
         let err= {...error}
         if (err.name === 'CastError') err = handleCastErrorDB(err);
         if (err.code === 11000) err = handleDuplicateFieldsDB(err);
         if (err.name === 'ValidationError')
            err = handleValidationErrorDB(err)
         if(err.name==="JsonWebTokenError") {
             err=handleJWTError(err)
             console.log("jwt error")
        }
        sendProdError(error,req, res);
    } else {
        console.log("Unknown environment .....");
    }
    
};
