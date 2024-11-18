const catchAsync = require("../utils/catchAsync");
const errorHandler = require("../utils/AppError")
const ModernAPI= require("../utils/ModernAPI")


exports.deleteOne=(Model)=> catchAsync(async (req,res,next)=>{
    
        const {id}=req.params
        console.log(id)
        const document = await Model.findByIdAndDelete(id)    
        if(!document){
            return   next(new errorHandler("No document Found",404))
        }
        res.status(200).json({
        status: "succes",
        data:{
            document
        }
        })
    })


exports.getOne= (Model,popOption)=>catchAsync(async (req,res,next)=>{
    const {id}=req.params
    let query= Model.findOne({_id:id})
    if(popOption) query = query.populate(popOption)
    const document= await  query
    if(!document){
        return   next(new errorHandler("Document Not Found",404))
    }
    res.status(200).json({
        status: "succes",
        data:{
            document
        }
    })
 }) 
 exports.updateOne= Model=>catchAsync( async (req,res,next)=>{
    const {id}=req.params
    const{body}=req
    console.log("before update")

    const document= await Model.findByIdAndUpdate(id,body,{new:true,runValidators:true})
    console.log("after update")
    if(!document){
        return   next(new errorHandler("Document Not Found",404))
    }
    res.status(200).json({
        status: "succes",
        data:{
            document
        }
    })
    
})
exports.createOne=Model=>catchAsync(async (req,res,next)=>{
    const  post=req.body
    console.log(post)

    const  document= await Model.create({...post})
      res.status(200).json({
      status:"succes",
      data:{
          document
      }
      }) 
  })


exports.getAll=Model=>catchAsync( async (req,res,next)=>{ 
    let filter={}
    if(req.params.tourId) filter.tour=req.params.tourId
    const features= new ModernAPI(Model.find(filter),req.query)
    features
       .filter()
       .sort()
       .project()
       .paginate()
     const tours= await features.query
      res.status(200).json({
          status:"succes",
          result:tours.length,
          data: tours
      })
})

