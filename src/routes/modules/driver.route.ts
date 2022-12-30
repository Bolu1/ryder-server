import express from "express"
const controller = require("../../controllers/driver.controller")
const isAdmin = require('../../middleware/isAdmin')
const isAuth = require('../../middleware/isAuth')
const multer = require('multer')
import path from 'path'


const storage = multer.diskStorage({
  destination: (req, file, callback) =>{
    callback(null, "./static/")
  },
  filename: (req, file, callback) =>{
    callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb)
  }
})

const checkFileType = (file, cb) =>{

  const filetypes = /jpeg|jpg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if(mimetype && extname){
    return cb(null, true)
  }else{
    cb('Error: Images Only')
  }
}



const router = express()

// non-protected route
router.post("/signup", controller.addUser)
router.post("/signin", controller.login)
router.post("/verifyAuthSmsOTP", controller.verifyAuthSmsOTP)
router.post("/verifyEmailOTP", controller.verifyEmailOTP)
router.post("/verifyAuthResetOTP", controller.verifyAuthResetOTP)
router.post("/resendEmailOTP", controller.resendEmailOTP)
router.post("/resendSmsOTP", controller.resendSmsOTP)
router.post('/forgotPassword', controller.forgotPassword)
router.post('/confirmPassword', controller.confirmPassword)
router.post('/sendSmsOTP', controller.sendSmsOTP)
router.post('/setPassword', controller.setPassword)
router.post('/setEmail', controller.setEmail)
// protected routes
router.get('/drivers', isAdmin, controller.getUsers)

// notifications
router.get('/notifications', isAuth, controller.getNotifications)
router.patch('/update', isAuth, controller.updateDetails)
router.patch('/updatePassword', isAuth, controller.updatePassword)
router.delete('/delete', isAuth, controller.deleteDriver)


module.exports = router