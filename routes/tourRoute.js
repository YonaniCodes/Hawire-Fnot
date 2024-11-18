const express = require('express')
const router= express.Router()
const tourController=require("../controllers/tourController")
const authController=require("../controllers/authController")
const reviewRouter= require("./reviewRoute")


router.route("/tours-with-in/:distance/center/:latLong/unit/:unit",)
      .get(tourController.getToursWithIn)
router.route("/distances/center/:latLong/unit/:unit",)
      .get(tourController.getToursDistance)
router.use('/:tourId/reviews',reviewRouter)
router.route('/tour-stat')
      .get(tourController.getTourStat)
 
router.route('/tour-per-month/:year')
      .get(tourController.getTourPerMonth)
router.route('/').
  get(tourController.getAllTours).
  post(authController.protect,authController.restrictTo("admin","lead-guide"),tourController.createTour)


router.route('/:id')
  .get(tourController.getATour)
  .patch(
     authController.protect,
     authController.restrictTo("admin","lead-guide"),
     tourController.uploadTourImage,
     tourController.resizeToursImage,
     tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin","lead-guide"),
    tourController.deleteTour)


// router.route('/:tourId/reviews')
//     .get( authController.protect,tourController.getReviews)
//     .post(authController.protect, authController.restrictTo("user"),reviewController.createReview)

  
module.exports=router