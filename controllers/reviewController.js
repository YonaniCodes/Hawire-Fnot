const Review= require("../model/reviewModel")
const catchAsync= require("../utils/catchAsync")
const factory= require("./handlerFactory")


exports.setTourAndUserIDS=(req,res,next)=>{
  req.body.tour=req.body.tour|| req.params.tourId
  req.body.user= req.body.user|| req.user.id
  next()

}
exports.getAllReviews= factory.getAll(Review)
exports.createReview=factory.createOne(Review)
exports.deleteReview=factory.deleteOne(Review)
exports.getReview=factory.getOne(Review)
exports.updateReview=factory.updateOne(Review)

