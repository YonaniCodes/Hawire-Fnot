const router= require("express").Router()
const viewControler=require("../controllers/viewControler")
const authControler= require('../controllers/authController')

router.get("/",authControler.isLogedin,viewControler.getOverview)
router.get("/overview",authControler.isLogedin,viewControler.getOverview)
router.get("/tour/:slug",authControler.isLogedin,viewControler.getTour)
router.get("/login",authControler.isLogedin,viewControler.getLoginForm)
router.get("/logout",authControler.isLogedin,authControler.logout)
router.get("/me",authControler.protect,viewControler.getAccount)



  module.exports=router