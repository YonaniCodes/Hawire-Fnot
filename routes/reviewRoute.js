const express = require('express')
const router= express.Router({mergeParams: true})
const reviewControler= require("../controllers/reviewController")
const authControler= require("../controllers/authController")

router.use(authControler.protect)

router.route('/')
    .post(
         authControler.restrictTo("user")
        ,reviewControler.setTourAndUserIDS
        ,reviewControler.createReview)
    .get(reviewControler.getAllReviews)

router.route('/:id')
    .delete(authControler.restrictTo("user","admin")
            ,reviewControler.deleteReview)
    .get(reviewControler.getReview)
    .patch(
        authControler.restrictTo("user","admin")
        ,reviewControler.updateReview)


module.exports=router