const express= require('express') 
const path= require("path")
const ErrorHandler= require('./utils/AppError')
const helmet= require("helmet")
const ErrorController= require('./controllers/errorControler')
const mongoSanitize= require("express-mongo-sanitize")
const xss= require("xss-clean")
const hpp=require("hpp")
const cookieParse= require("cookie-parser")
const rateLimit= require("express-rate-limit")
const tourRouter= require("./routes/tourRoute") 
const userRouter= require("./routes/userRoute")
const reviewRouter= require("./routes/reviewRoute")
const viewRouter= require("./routes/viewRoute")
const multer= require("multer")
const app= express()
// Setting view-Engine for front-end
app.set('view engine','pug')
app.set('views',path.join(__dirname,"view"))

// 1 Global Middlewares

//  serving Static file
app.use(express.static(path.join(__dirname,"public")))
limiter=rateLimit({
  max:100,
  windowMs:3600*1000,
  message:"Please try again"
})
 
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com','*'],
      objectSrc: ["'none'"],
      // add other directives as needed
    },
  })
);


app.use(helmet()) 
app.use(express.json({limit:"10kb"}))
app.use(cookieParse())

// express ratelimitter
app.use('/api',limiter)

// data sanitization against no sql injection
app.use(mongoSanitize())

// data sanitation against xss attack
app.use(xss())
// PREVENT PARAMETER POLLUTION
app.use(hpp({
  whitelist:
    ["duration","ratingQuantity","price","dificulty"],
  
}))


// all route testing
app.use((req, res, next) => { 
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
// 2 Route 
app.use('/',viewRouter)
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/reviews',reviewRouter)



app.all('*',(req,res,next)=>{ 
  const error = new ErrorHandler(`can't get ${req.originalUrl} on the sever`,404)
  next(error)
})
 
app.use(ErrorController)
module.exports=app