const express = require('express')
const router = express.Router()
const userControll=require("../controllers/userController")
const authController=require("../controllers/authController")


router.route('/signup')
  .post(authController.signup)
router.route('/login')
  .post(authController.login)
router.route('/forgotPassword')
   .post(authController.forgotPassword)
router.route('/resetPassword/:token')
   .patch(authController.resetPassword)


//  Protect All routes after this middlewares

router.use(authController.protect)

router.route('/updateMyPassword')
      .patch(authController.updateMyPassword)

router.route('/me')
      .get(userControll.getMe,userControll.getUser)

router.route('/updateMe')
      .patch(
        userControll.uploadUserPhoto,
        userControll.resizeUserPhotosImage,
        userControll.updateMe)

router.route('/deleteMe')
    .delete(userControll.deleteMe)


router.use(authController.restrictTo("admin"))
router.route('/')
  .get(userControll.getAllUsers)
  .post(userControll.createUser)

router.route('/:id')
  .get(userControll.getUser)
  .patch(userControll.updateUser)
  .delete(userControll.deleteUser)
module.exports=router