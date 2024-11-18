const { isMultibyte } = require("validator")
const Tour =require("../model/toursModel")
const catchAsync= require("../utils/catchAsync")
const factory= require("./handlerFactory")
const multer= require("multer")
const sharp= require("sharp")


const storage= multer.memoryStorage()
fileFilter=(req,file,cb)=>{

  if(file.mimetype.startsWith("image"))
     return cb(null, true)
  cb(new errorHandler("Only photos can be uploaded!",400),false)
}
const upload= multer(
  {storage,fileFilter})
 
exports.uploadTourImage=upload.fields([
    {
        name:"imageCover",
        maxCount:1
       },
    {
        name:"images",
        maxCount:3
    },

]
    
)
exports.resizeToursImage=catchAsync(async (req,res)=>{

    if(!req.files)
       return next()

    // 1 Process cover Image
    // req.files.imageCover[0].filename
    req.body.coverImage= `tour-${req.params.id}-${Date.now()}-cover`
    await sharp(req.files.imageCover[0])
    .resize(2000,1333)
    .toFormat("jpeg")
    .jpeg({quality:90})
    .toFile(`public/img/tours/${req.body.coverImage}`)
    
    // 2 process images
  req.body.images=[]
  await promises.all(req.files.images.map(async(image,index)=>{
    const fileName= `tour-${req.params.id}-${Date.now()}-${index+1}.jpeg`
     await sharp(image.buffer)
     .resize(2000,1333)
     .toFormat("jpeg")
     .jpeg({quality:90})
     .toFile(`public/img/tours/${fileName}`)

     req.body.images.push(fileName)
 }))  
     next()

})
exports.getATour=factory.getOne(Tour,"reviews")
exports.updateTour= factory.updateOne(Tour)
exports.deleteTour=factory.deleteOne(Tour)
exports.createTour=factory.createOne(Tour)
exports.getAllTours=factory.getAll(Tour)
exports.getToursWithIn= async (req,res, next)=>{
    const {distance,unit,latLong}= req.params
    const [latitude,longtiude]=latLong.split(",")
    if(!latitude || !longtiude){
        next(new errorhandler("provide lat,long",500))
    }

   const radius= unit==="mi"? distance/3963.3:distance/6378.1
     

    const tours= await Tour.find({
        startLocation:{
            $geoWithin:{
                $centerSphere:[[longtiude,latitude],radius]
            }
        }
    })
    res.status(200).json({
        results:tours.length,
        tours
  })
    
}


exports.getToursDistance= async(req,res,next)=>{

    const {unit,latLong}= req.params
    const [latitude,longtiude] = latLong.split(",")
    const nearTours= await Tour.aggregate([
        {
            $geoNear:{
              near:  {
                    type:"point",
                    coordinates:[longtiude*1,latitude*1]
                },
              
            },
            distanceField:"distance"
        }
    ])
    res.status(200).json({
        status:"succes",
        unit,
        latLong
 })


}

exports.getToursDistance = async (req, res, next) => {
    try {
        const { unit, latLong } = req.params;
        const [latitudeInput, longitudeInput] = latLong.split(",");

        // Parse input to floats
        const latitude = parseFloat(latitudeInput);
        const longitude = parseFloat(longitudeInput);

        // Validate latitude and longitude
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ status: "fail", message: "Invalid latitude or longitude." });
        }
        const muliplier= unit==='mi'?0.000621371:0.001
        // Set up the aggregation pipeline
        const nearTours = await Tour.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longitude, latitude], // Make sure coordinates are in [longitude, latitude] order
                    },
                    distanceField: "distance",
                    distanceMultiplier:muliplier
                
                 }
            },
            {
                $project:{
                    name:1,
                    distance:1
                }
            },
            {
                $sort:{
                    distance:1
                }
            }
           
        ]);

        // Respond with the results
        res.status(200).json({
            status: "success",
            unit,
            latLong,
            nearTours
        });
    } catch (error) {
        next(error); // Pass errors to error handling middleware
    }
};


exports.getTourStat= catchAsync(async (req, res ,next)=>{

    const stat= await Tour.aggregate([
            {
                $match:{ratingsAverage:{$gte:4.5}}
            },
            {
                $group:{
                    _id:"$difficulty",
                    tourCount:{$count:{}},
                    maxPrice:{$max:"$price"},
                    minPrice:{$min:"$price"},
                   average:{$avg:"$price"}
                }
            }
    ])
    res.status(200).json({
            status:"succes",
            stat
     })
})

exports.getTourPerMonth= catchAsync(async (req, res ,next)=>{
    const {year}=req.params
    console.log(2000)

    const stat= await Tour.aggregate([
            {
                $unwind:"$startDates"
             },
             {
                $match:{startDates:{$gte: new Date(`${year}-01-01`),$lte:new Date(`${year}-12-31`)}}
             },
            {
                $group:{
                    _id:{$month:"$startDates"},
                      tourCount:{$count:{}},
                      // collecting  tour names
                     tours:{$push:"$name"}
                 }
            },
            
            {
                $addFields:{month:"$_id"}
            },
            {
                $project:{_id:0}
            },
            {
                $sort:{tourCount:-1}
            }
            
    ])
    res.status(200).json({
            status:"succes",
            stat
     })
})
 
