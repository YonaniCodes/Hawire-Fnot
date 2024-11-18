const catchAsync = require("../utils/catchAsync");
const Tour = require("../model/toursModel")
const errorHandler= require("../utils/AppError")
 exports.getHomePage= catchAsync(async (req,res, next)=>{
     res.status(200).render('base',{
        title: "Natours | Exciting tours for adventurous people"
    })
  }
)

exports.getTour=catchAsync(async (req,res, next)=>{

  const tour = await Tour.findOne({slug:req.params.slug}).populate({
    path:"reviews",
    fields:"rating user review"
  }
  )

  if(!tour)
    return next(new errorHandler("NO Such Tour With This Name",401))
  

   res.status(200).render('tour',{
      title:`${tour.name} T`,
      tour
  })
}
)
exports.getOverview=catchAsync(async (req,res, next)=>{

    const tours = await Tour.find()
     res.status(200).render('overview',{
        title: "Natours | Exciting tours for adventurous people",
        tours
    })
  }
)


exports.getLoginForm=catchAsync(async (req,res, next)=>{

  const tours = await Tour.find()
   res.status(200).render('login',{
      title: "Log in to your account",
   
  })
}
)


exports.getAccount= catchAsync(async (req,res, next)=>{

   res.status(200).render('account',{
      title: "My Account",
   
  })
}
)

