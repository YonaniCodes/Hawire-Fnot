const User= require("../model/userModel")
const catchAsync= require("../utils/catchAsync")
const errorHandler=require("../utils/AppError")
const factory= require("./handlerFactory")
const multer= require("multer")
const sharp= require("sharp")

// const storage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,"public/img/users")
//   },
//   filename:(req,file,cb)=>{
//     const extension=file.mimetype.split("/")[1]
//     cb(null,`user-${req.user.id}-${Date.now()}.${extension}`)
//   }
// })
const storage= multer.memoryStorage()
fileFilter=(req,file,cb)=>{

  if(file.mimetype.startsWith("image"))
     return cb(null, true)
  cb(new errorHandler("Only photos can be uploaded!",400),false)
}
const upload= multer(
  {storage,fileFilter})

exports.uploadUserPhoto=upload.single("photo")
 
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.resizeUserPhotosImage=catchAsync(async (req,res,next)=>{
  if(!req.file)  return next()
    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
    console.log(req.file.buffer)
   await sharp(req.file.buffer)
     .resize(500,500)
     .toFormat("jpeg")
     .jpeg({quality:90})
     .toFile(`public/img/users/${req.file.filename}`)
  next() 
})
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new errorHandler(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if(req.file)
   filteredBody.photo=req.file.filename
   console.log(filteredBody," are going to updated")

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: 'uv'
  });
});
exports.createUser=catchAsync( async (req,res,next)=>{ 
 
  res.status(500).json({
    status:"Error",
   message:"This route is not defined please use signup instead"
})
})
exports.getAllUsers=factory.getAll(User)
exports.updateUser =factory.updateOne(User)
exports.deleteUser =factory.deleteOne(User)
exports.getUser = factory.getOne(User)
